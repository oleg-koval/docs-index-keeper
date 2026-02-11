import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdirSync, writeFileSync, rmSync, existsSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import { loadConfig } from './config.js'

describe('loadConfig', () => {
  let tmpDir: string

  beforeEach(() => {
    tmpDir = join(tmpdir(), `docs-index-keeper-config-test-${Date.now()}`)
    mkdirSync(tmpDir, { recursive: true })
  })

  afterEach(() => {
    if (existsSync(tmpDir)) rmSync(tmpDir, { recursive: true })
  })

  it('returns defaults when no config exists', () => {
    const cfg = loadConfig(tmpDir)
    expect(cfg.indexFile).toBe('docs/README.md')
    expect(cfg.docsDir).toBe('docs')
    expect(cfg.exclude).toContain('README.md')
    expect(cfg.exclude).toContain('archive/')
    expect(cfg.warnRootMd).toBe(true)
  })

  it('merges package.json docsIndexKeeper over defaults', () => {
    writeFileSync(
      join(tmpDir, 'package.json'),
      JSON.stringify({
        docsIndexKeeper: {
          indexFile: 'docs/INDEX.md',
          docsDir: 'doc',
        },
      }),
    )
    const cfg = loadConfig(tmpDir)
    expect(cfg.indexFile).toBe('docs/INDEX.md')
    expect(cfg.docsDir).toBe('doc')
    expect(cfg.exclude).toContain('README.md')
  })

  it('merges .docs-index-keeper.json when no package.json config', () => {
    writeFileSync(
      join(tmpDir, '.docs-index-keeper.json'),
      JSON.stringify({
        indexFile: 'custom/readme.md',
        warnRootMd: false,
      }),
    )
    const cfg = loadConfig(tmpDir)
    expect(cfg.indexFile).toBe('custom/readme.md')
    expect(cfg.warnRootMd).toBe(false)
  })

  it('prefers package.json over rc file', () => {
    writeFileSync(
      join(tmpDir, 'package.json'),
      JSON.stringify({ docsIndexKeeper: { docsDir: 'from-pkg' } }),
    )
    writeFileSync(
      join(tmpDir, '.docs-index-keeper.json'),
      JSON.stringify({ docsDir: 'from-rc' }),
    )
    const cfg = loadConfig(tmpDir)
    expect(cfg.docsDir).toBe('from-pkg')
  })
})
