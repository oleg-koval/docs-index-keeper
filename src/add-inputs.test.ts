import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import { mkdirSync, rmSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import { resolveAddInputs } from './add-inputs.js'

describe('resolveAddInputs', () => {
  let rootDir: string

  beforeEach(() => {
    rootDir = join(tmpdir(), `docs-index-keeper-add-inputs-${Date.now()}`)
    mkdirSync(join(rootDir, 'docs', 'plans'), { recursive: true })
    writeFileSync(join(rootDir, 'docs', 'plans', '01.md'), '# 01')
    writeFileSync(join(rootDir, 'docs', 'plans', '02.md'), '# 02')
    writeFileSync(join(rootDir, 'docs', 'README.md'), '# Index')
  })

  afterEach(() => {
    if (existsSync(rootDir)) rmSync(rootDir, { recursive: true })
  })

  it('expands quoted glob masks to matching files', () => {
    const paths = resolveAddInputs(rootDir, ['docs/plans/*.md'])
    expect(paths).toEqual(['docs/plans/01.md', 'docs/plans/02.md'])
  })

  it('keeps direct paths and adds expanded masks', () => {
    const paths = resolveAddInputs(rootDir, ['docs/README.md', 'docs/plans/*.md'])
    expect(paths).toEqual(['docs/README.md', 'docs/plans/01.md', 'docs/plans/02.md'])
  })

  it('deduplicates overlapping direct and expanded inputs', () => {
    const paths = resolveAddInputs(rootDir, ['docs/plans/01.md', 'docs/plans/*.md'])
    expect(paths).toEqual(['docs/plans/01.md', 'docs/plans/02.md'])
  })
})
