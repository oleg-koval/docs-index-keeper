import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import {
  getStagedMdFiles,
  getStagedDocs,
  getFirstHeading,
  parseTable,
  insertRows,
  update,
  check,
} from './index.js'
import type { DocsIndexKeeperConfig } from './config.js'

const config: DocsIndexKeeperConfig = {
  indexFile: 'docs/README.md',
  docsDir: 'docs',
  exclude: ['README.md', 'archive/'],
  allowedRootMd: ['README.md'],
  warnRootMd: false,
}

describe('parseTable', () => {
  it('parses markdown table rows', () => {
    const content = `# Doc index
| Doc | Purpose |
|-----|---------|
| [deploy](deployment.md) | Deploy stuff |
| [archive/](archive/) | Historical |
`
    const rows = parseTable(content)
    expect(rows).toEqual([
      { title: 'deploy', path: 'deployment.md' },
      { title: 'archive/', path: 'archive/' },
    ])
  })

  it('returns empty array when no table', () => {
    expect(parseTable('no table here')).toEqual([])
  })
})

describe('insertRows', () => {
  it('inserts before sentinel', () => {
    const before = `| Doc | Purpose |
|-----|---------|
| [archive/](archive/) | Historical |`
    const after = insertRows(before, [
      { path: 'foo.md', title: 'foo', purpose: 'Foo doc' },
    ])
    expect(after).toContain('| [foo](foo.md) | Foo doc |')
    expect(after).toContain('| [archive/](archive/) | Historical |')
    expect(after.indexOf('foo')).toBeLessThan(after.indexOf('archive/'))
  })

  it('inserts at end when no sentinel', () => {
    const before = `| Doc | Purpose |
|-----|---------|
| [a](a.md) | A |`
    const after = insertRows(before, [{ path: 'b.md', title: 'b', purpose: 'B' }])
    expect(after).toContain('| [b](b.md) | B |')
  })
})

describe('getFirstHeading', () => {
  let tmpDir: string

  beforeEach(() => {
    tmpDir = join(tmpdir(), `docs-index-keeper-test-${Date.now()}`)
    mkdirSync(tmpDir, { recursive: true })
  })

  afterEach(() => {
    if (existsSync(tmpDir)) rmSync(tmpDir, { recursive: true })
  })

  it('extracts first h1', () => {
    writeFileSync(join(tmpDir, 'doc.md'), '# My Title\n\nBody')
    expect(getFirstHeading(tmpDir, 'doc.md')).toBe('My Title')
  })

  it('extracts first heading regardless of level', () => {
    writeFileSync(join(tmpDir, 'doc.md'), '## H2 First')
    expect(getFirstHeading(tmpDir, 'doc.md')).toBe('H2 First')
  })

  it('returns null for missing file', () => {
    expect(getFirstHeading(tmpDir, 'missing.md')).toBeNull()
  })
})

describe('getStagedDocs', () => {
  it('filters to docs dir and excludes config', () => {
    const staged = ['docs/foo.md', 'docs/README.md', 'docs/archive/old.md', 'other/bar.md']
    const docs = getStagedDocs(staged, config)
    expect(docs).toEqual(['docs/foo.md'])
  })
})

describe('getStagedMdFiles', () => {
  it('uses DOCS_INDEX_KEEPER_STAGED env when set', () => {
    const orig = process.env.DOCS_INDEX_KEEPER_STAGED
    process.env.DOCS_INDEX_KEEPER_STAGED = 'docs/foo.md\ndocs/bar.md\n'
    try {
      const files = getStagedMdFiles()
      expect(files).toEqual(['docs/foo.md', 'docs/bar.md'])
    } finally {
      if (orig !== undefined) process.env.DOCS_INDEX_KEEPER_STAGED = orig
      else delete process.env.DOCS_INDEX_KEEPER_STAGED
    }
  })

  it('uses stagedOverride when provided', () => {
    const files = getStagedMdFiles('docs/a.md\nREADME.md')
    expect(files).toEqual(['docs/a.md', 'README.md'])
  })
})

describe('update and check (integration)', () => {
  let tmpDir: string

  beforeEach(() => {
    tmpDir = join(tmpdir(), `docs-index-keeper-test-${Date.now()}`)
    mkdirSync(join(tmpDir, 'docs'), { recursive: true })
  })

  afterEach(() => {
    if (existsSync(tmpDir)) rmSync(tmpDir, { recursive: true })
  })

  it('adds new doc to index', () => {
    const indexContent = `# Doc index
| Doc | Purpose |
|-----|---------|
| [archive/](archive/) | Historical |
`
    writeFileSync(join(tmpDir, 'docs', 'README.md'), indexContent)
    writeFileSync(join(tmpDir, 'docs', 'new-doc.md'), '# New Doc\nContent')

    const result = update(tmpDir, config, 'docs/new-doc.md')
    expect(result.updated).toBe(true)
    expect(result.added).toHaveLength(1)
    expect(result.added[0].path).toBe('new-doc.md')
    expect(result.added[0].purpose).toBe('New Doc')

    const content = readFileSync(join(tmpDir, 'docs', 'README.md'), 'utf-8')
    expect(content).toContain('| [new-doc](new-doc.md) | New Doc |')
  })

  it('check returns false when index would change', () => {
    const indexContent = `| Doc | Purpose |
|-----|---------|
| [archive/](archive/) | Historical |
`
    writeFileSync(join(tmpDir, 'docs', 'README.md'), indexContent)
    writeFileSync(join(tmpDir, 'docs', 'unindexed.md'), '# Unindexed')

    const ok = check(tmpDir, config, 'docs/unindexed.md')
    expect(ok).toBe(false)
  })

  it('check returns true when index is up to date', () => {
    const indexContent = `| Doc | Purpose |
|-----|---------|
| [indexed](indexed.md) | Indexed |
| [archive/](archive/) | Historical |
`
    writeFileSync(join(tmpDir, 'docs', 'README.md'), indexContent)
    writeFileSync(join(tmpDir, 'docs', 'indexed.md'), '# Indexed')

    const ok = check(tmpDir, config, 'docs/indexed.md')
    expect(ok).toBe(true)
  })
})
