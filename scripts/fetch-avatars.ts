/*
Builds pages/34/avatars.json — the data behind the "Thank you" wall.

Flow:
  1. Resolve the team / major-contributor split.
     a. Prefer ../vike/docs/pages/team/teamData.ts (local checkout)
        so unpushed edits are reflected immediately.
     b. Otherwise fetch https://vike.dev/team.json.
     c. Otherwise use the hardcoded FALLBACK_* constants.
  2. Fetch all contributors from vikejs/vike and telefunc/telefunc via
     the GitHub REST API (paginated), then merge them into one map
     keyed by login. Contributions sum across repos; bots and non-User
     accounts are dropped.
  3. For every team and major-contributor login, look up the avatar
     in that merged map. Anyone missing (e.g. core team who never
     committed directly to either repo) is filled in via GET /users/<login>.
  4. Take the top (TOP_N − team − major) remaining contributors by
     contribution count and use them as the "rest" bucket.
  5. Write { team, majorContributors, rest } to pages/34/avatars.json.

Slide 34 imports that JSON and renders a 10-column wall, revealing
the three buckets in order via display:contents Reveals.
*/

import fs from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const TEAM_FEED_URL = 'https://vike.dev/team.json'

// Local checkout of vike/docs takes precedence over the remote feed so
// unpushed edits to teamData.ts are reflected immediately.
const LOCAL_TEAM_DATA = path.resolve(__dirname, '../../vike/docs/pages/team/teamData.ts')

// Used only if neither the local file nor the remote feed is reachable.
const FALLBACK_TEAM = ['brillout', 'magne4000', 'nitedani', 'richard-unterberg', 'phonzammi']
const FALLBACK_MAJOR_CONTRIBUTORS = ['NilsJacobsen', 'louwers', 'ambergristle', 'lourot', '4350pChris', 'Blankeos']

type TeamEntry = { username: string; firstName: string; isCoreTeam: boolean }

function splitEntries(entries: TeamEntry[]): { team: string[]; majorContributors: string[] } {
  return {
    team: entries.filter((e) => e.isCoreTeam).map((e) => e.username),
    majorContributors: entries.filter((e) => !e.isCoreTeam).map((e) => e.username),
  }
}

async function fetchTeamLists(): Promise<{ team: string[]; majorContributors: string[] }> {
  if (existsSync(LOCAL_TEAM_DATA)) {
    try {
      console.log(`Loading team list from local ${path.relative(process.cwd(), LOCAL_TEAM_DATA)}`)
      const mod = (await import(LOCAL_TEAM_DATA)) as { teamData: TeamEntry[] }
      return splitEntries([...mod.teamData])
    } catch (err) {
      console.warn(`⚠️  Could not load local teamData.ts (${(err as Error).message}); trying remote.`)
    }
  }
  try {
    console.log(`Fetching team list from ${TEAM_FEED_URL}`)
    const res = await fetch(TEAM_FEED_URL)
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
    const entries = (await res.json()) as TeamEntry[]
    return splitEntries(entries)
  } catch (err) {
    console.warn(`⚠️  Could not fetch ${TEAM_FEED_URL} (${(err as Error).message}); using hardcoded fallback.`)
    return { team: FALLBACK_TEAM, majorContributors: FALLBACK_MAJOR_CONTRIBUTORS }
  }
}

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
  const { team: teamUsernames, majorContributors: majorContributorUsernames } = await fetchTeamLists()

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

  const team = await pickByLogin(byLogin, teamUsernames)
  const majorContributors = await pickByLogin(byLogin, majorContributorUsernames)

  const featured = new Set([...teamUsernames, ...majorContributorUsernames])
  const restBudget = TOP_N - team.length - majorContributors.length
  const rest: Avatar[] = [...byLogin.values()]
    .filter((c) => !featured.has(c.login))
    .sort((a, b) => b.contributions - a.contributions)
    .slice(0, restBudget)
    .map((c) => ({ login: c.login, avatar_url: c.avatar_url }))

  const out = { team, majorContributors, rest }
  const outPath = path.join(__dirname, '..', 'pages', '34', 'avatars.json')
  await fs.writeFile(outPath, JSON.stringify(out, null, 2) + '\n')

  console.log(
    `Saved ${team.length} team + ${majorContributors.length} major + ${rest.length} rest = ${team.length + majorContributors.length + rest.length} to ${path.relative(process.cwd(), outPath)}`,
  )
}

main().catch((error: unknown) => {
  console.error(`❌ Error: ${(error as Error).message}`)
  process.exit(1)
})
