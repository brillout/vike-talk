import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Team members listed on https://vike.dev/team (manually mirrored — that page
// has no public JSON feed). Kept here so they always appear in the wall even
// if their contribution count to the two repos below is low.
const TEAM_MEMBERS = [
  'brillout',
  'magne4000',
  'nitedani',
  'richard-unterberg',
  'phonzammi',
  'ambergristle',
  'NilsJacobsen',
  'AurelienLourot',
  '4350pChris',
  'Blankeos',
]

const REPOS = ['vikejs/vike', 'telefunc/telefunc']
const TOP_N = 50

type Contributor = {
  login: string
  id: number
  avatar_url: string
  contributions: number
  type: string
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

  const all = [...byLogin.values()]
  const team = all.filter((c) => TEAM_MEMBERS.includes(c.login))
  const rest = all
    .filter((c) => !TEAM_MEMBERS.includes(c.login))
    .sort((a, b) => b.contributions - a.contributions)

  // Team members first (so the wall starts with them), then top contributors.
  const top = [...team.sort((a, b) => b.contributions - a.contributions), ...rest].slice(0, TOP_N)

  const out = top.map((c) => ({ login: c.login, avatar_url: c.avatar_url }))
  const __filename = fileURLToPath(import.meta.url)
  const outPath = path.join(path.dirname(__filename), '..', 'pages', '34', 'avatars.json')
  await fs.writeFile(outPath, JSON.stringify(out, null, 2) + '\n')

  console.log(`Saved ${out.length} avatars to ${path.relative(process.cwd(), outPath)}`)
}

main().catch((error: unknown) => {
  console.error(`❌ Error: ${(error as Error).message}`)
  process.exit(1)
})
