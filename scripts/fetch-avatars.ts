import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Sourced from https://vike.dev/team. That page has no public JSON feed, so
// the two lists are mirrored here. Keep them in sync when the team page
// changes.
const TEAM = ['brillout', 'magne4000', 'nitedani', 'richard-unterberg', 'phonzammi']
const MAJOR_CONTRIBUTORS = ['ambergristle', 'NilsJacobsen', 'AurelienLourot', '4350pChris', 'Blankeos']

const REPOS = ['vikejs/vike', 'telefunc/telefunc']
const TOP_N = 50

type Contributor = {
  login: string
  id: number
  avatar_url: string
  contributions: number
  type: string
}

type Avatar = { login: string; avatar_url: string }

async function fetchUser(login: string): Promise<Avatar> {
  const url = `https://api.github.com/users/${login}`
  const res = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })
  if (!res.ok) {
    throw new Error(`GitHub API ${res.status} for ${url}: ${await res.text()}`)
  }
  const u = (await res.json()) as { login: string; avatar_url: string }
  return { login: u.login, avatar_url: u.avatar_url }
}

async function fetchAllContributors(repo: string): Promise<Contributor[]> {
  const all: Contributor[] = []
  for (let page = 1; page <= 10; page++) {
    const url = `https://api.github.com/repos/${repo}/contributors?per_page=100&page=${page}`
    const res = await fetch(url, {
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    })
    if (!res.ok) {
      throw new Error(`GitHub API ${res.status} for ${url}: ${await res.text()}`)
    }
    const batch = (await res.json()) as Contributor[]
    all.push(...batch)
    if (batch.length < 100) break
  }
  return all
}

async function pickByLogin(all: Map<string, Contributor>, logins: string[]): Promise<Avatar[]> {
  return Promise.all(
    logins.map(async (login) => {
      const c = all.get(login)
      if (c) return { login: c.login, avatar_url: c.avatar_url }
      // Fall back to /users/{login} for team members who haven't committed
      // to either repo directly.
      return fetchUser(login)
    }),
  )
}

async function main(): Promise<void> {
  console.log(`Fetching contributors from ${REPOS.join(', ')}...`)
  const lists = await Promise.all(REPOS.map(fetchAllContributors))

  // Merge by login, summing contributions across repos.
  const byLogin = new Map<string, Contributor>()
  for (const c of lists.flat()) {
    if (c.type !== 'User') continue
    if (c.login.endsWith('[bot]')) continue
    const existing = byLogin.get(c.login)
    if (existing) {
      existing.contributions += c.contributions
    } else {
      byLogin.set(c.login, { ...c })
    }
  }

  const team = await pickByLogin(byLogin, TEAM)
  const majorContributors = await pickByLogin(byLogin, MAJOR_CONTRIBUTORS)

  const featured = new Set([...TEAM, ...MAJOR_CONTRIBUTORS])
  const restBudget = TOP_N - team.length - majorContributors.length
  const rest: Avatar[] = [...byLogin.values()]
    .filter((c) => !featured.has(c.login))
    .sort((a, b) => b.contributions - a.contributions)
    .slice(0, restBudget)
    .map((c) => ({ login: c.login, avatar_url: c.avatar_url }))

  const out = { team, majorContributors, rest }
  const __filename = fileURLToPath(import.meta.url)
  const outPath = path.join(path.dirname(__filename), '..', 'pages', '34', 'avatars.json')
  await fs.writeFile(outPath, JSON.stringify(out, null, 2) + '\n')

  console.log(
    `Saved ${team.length} team + ${majorContributors.length} major + ${rest.length} rest = ${team.length + majorContributors.length + rest.length} to ${path.relative(process.cwd(), outPath)}`,
  )
}

main().catch((error: unknown) => {
  console.error(`❌ Error: ${(error as Error).message}`)
  process.exit(1)
})
