import { execSync } from 'child_process'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import type { DocsIndexKeeperConfig } from './config.js'

export interface IndexRow {
  title: string
  path: string
  purpose?: string
}

export function getStagedMdFiles(stagedOverride?: string): string[] {
  const envOverride = process.env.DOCS_INDEX_KEEPER_STAGED
  if (stagedOverride ?? envOverride) {
    const raw = (stagedOverride ?? envOverride)!
    return raw
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.endsWith('.md'))
  }
  const out = execSync('git diff --cached --name-only', { encoding: 'utf-8' })
  return out
    .split('\n')
    .map((s) => s.trim())
    .filter((s) => s.endsWith('.md'))
}

export function getStagedDocs(staged: string[], config: DocsIndexKeeperConfig): string[] {
  const docsPrefix = config.docsDir + '/'
  return staged.filter((p) => {
    if (!p.startsWith(docsPrefix)) return false
    const rel = p.slice(docsPrefix.length)
    if (config.exclude.some((e) => rel === e || rel.startsWith(e))) return false
    return true
  })
}

export function getFirstHeading(root: string, filePath: string): string | null {
  const full = join(root, filePath)
  if (!existsSync(full)) return null
  const content = readFileSync(full, 'utf-8')
  const match = content.match(/^#+\s+(.+)$/m)
  return match ? match[1].trim() : null
}

export function parseTable(readmeContent: string): IndexRow[] {
  const lines = readmeContent.split('\n')
  const rows: IndexRow[] = []
  let inTable = false
  for (const line of lines) {
    if (line.startsWith('|') && line.includes('|')) {
      inTable = true
      const linkMatch = line.match(/\|\s*\[([^\]]+)\]\(([^)]+)\)\s*\|/)
      if (linkMatch) rows.push({ title: linkMatch[1], path: linkMatch[2] })
    } else if (inTable && !line.trim().startsWith('|')) {
      break
    }
  }
  return rows
}

export function warnRootMd(staged: string[], config: DocsIndexKeeperConfig): void {
  if (!config.warnRootMd) return
  const rootMd = staged.filter((p) => !p.includes('/') || p.startsWith('.github/'))
  const inRoot = rootMd.filter((p) => {
    const base = p.replace(/^.*\//, '')
    return !config.allowedRootMd.includes(base)
  })
  if (inRoot.length) {
    console.warn(
      '[docs-index-keeper] New/changed .md in root or .github:',
      inRoot.join(', '),
      '\nConsider moving to docs/ and they will be added to the index.',
    )
  }
}

export function computeNewRows(
  root: string,
  stagedDocs: string[],
  existingPaths: Set<string>,
  config: DocsIndexKeeperConfig,
): IndexRow[] {
  const toAdd: IndexRow[] = []
  for (const p of stagedDocs) {
    const path = p.replace(new RegExp(`^${config.docsDir}/`), '')
    if (existingPaths.has(path)) continue
    const titleFromPath = path.replace(/\.md$/, '').replace(/-/g, ' ')
    const purpose = getFirstHeading(root, p) || titleFromPath
    const title = path.replace(/\.md$/, '')
    toAdd.push({ path, title, purpose })
    existingPaths.add(path)
  }
  return toAdd
}

export function insertRows(readme: string, newRows: IndexRow[], sentinelPattern = '| [archive/]'): string {
  const newLines = newRows.map(({ path, title, purpose }) => `| [${title}](${path}) | ${purpose ?? title} |`)
  let insertIdx = readme.indexOf(sentinelPattern)
  if (insertIdx === -1) insertIdx = readme.indexOf('\n\n', readme.indexOf('| Doc | Purpose |'))
  if (insertIdx === -1) insertIdx = readme.length
  return readme.slice(0, insertIdx) + newLines.join('\n') + '\n' + readme.slice(insertIdx)
}

export interface UpdateResult {
  updated: boolean
  added: IndexRow[]
}

export function update(
  root: string,
  config: DocsIndexKeeperConfig,
  stagedOverride?: string,
): UpdateResult {
  const indexPath = join(root, config.indexFile)
  const staged = getStagedMdFiles(stagedOverride)
  if (!staged.length) return { updated: false, added: [] }

  warnRootMd(staged, config)

  const stagedDocs = getStagedDocs(staged, config)
  if (!stagedDocs.length) return { updated: false, added: [] }

  if (!existsSync(indexPath)) return { updated: false, added: [] }

  let readme = readFileSync(indexPath, 'utf-8')
  const existing = parseTable(readme)
  const existingPaths = new Set(existing.map((r) => r.path))

  const toAdd = computeNewRows(root, stagedDocs, existingPaths, config)
  if (!toAdd.length) return { updated: false, added: [] }

  readme = insertRows(readme, toAdd)
  writeFileSync(indexPath, readme)
  return { updated: true, added: toAdd }
}

export function check(root: string, config: DocsIndexKeeperConfig, stagedOverride?: string): boolean {
  const indexPath = join(root, config.indexFile)
  const staged = getStagedMdFiles(stagedOverride)
  const stagedDocs = getStagedDocs(staged, config)
  if (!stagedDocs.length || !existsSync(indexPath)) return true

  const readme = readFileSync(indexPath, 'utf-8')
  const existing = parseTable(readme)
  const existingPaths = new Set(existing.map((r) => r.path))

  for (const p of stagedDocs) {
    const path = p.replace(new RegExp(`^${config.docsDir}/`), '')
    if (!existingPaths.has(path)) return false
  }
  return true
}
