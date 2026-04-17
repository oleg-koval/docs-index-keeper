#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync, chmodSync, statSync } from 'fs'
import { join } from 'path'
import { loadConfig } from './config.js'
import { update, check, getFirstHeading, parseTable, insertRows } from './index.js'
import { resolveAddInputs } from './add-inputs.js'

const root = process.cwd()

function printHelp(): void {
  console.log(`
docs-index-keeper — Keep docs index in sync when new .md files are added

Usage:
  docs-index-keeper init     Add pre-commit hook (husky or plain git)
  docs-index-keeper update   Update index from staged .md files (for pre-commit)
  docs-index-keeper check   Dry run; exit 1 if index would change (for CI)
  docs-index-keeper add <path|mask...>  Add one or many files to the index

Config: package.json "docsIndexKeeper" or .docs-index-keeper.json

Examples:
  npx docs-index-keeper init
  DOCS_INDEX_KEEPER_STAGED="docs/foo.md" npx docs-index-keeper check
`)
}

async function initAsync(): Promise<void> {
  const config = loadConfig(root)
  const indexPath = config.indexFile
  const huskyPreCommit = `
# When new/changed .md under docs/ are staged, add them to ${indexPath}
staged_md=$(git diff --cached --name-only | grep '\\.md$' || true)
if [ -n "$staged_md" ]; then
  npx docs-index-keeper update
  git add ${indexPath} 2>/dev/null || true
fi
`.trim()

  const huskyDir = join(root, '.husky')
  const huskyPreCommitPath = join(huskyDir, 'pre-commit')

  if (existsSync(huskyDir)) {
    writeFileSync(huskyPreCommitPath, huskyPreCommit)
    console.log('[docs-index-keeper] Updated .husky/pre-commit')
    return
  }
  const gitHooks = join(root, '.git', 'hooks')
  const preCommitPath = join(gitHooks, 'pre-commit')
  if (existsSync(join(root, '.git'))) {
    const content = `#!/bin/sh
${huskyPreCommit}
`
    writeFileSync(preCommitPath, content)
    chmodSync(preCommitPath, 0o755)
    console.log('[docs-index-keeper] Added .git/hooks/pre-commit')
  } else {
    console.log('[docs-index-keeper] Not a git repo. Run "git init" first, or install husky and re-run init.')
    console.log('  For husky: npm i -D husky && npx husky init')
  }
}

async function main(): Promise<void> {
  const args = process.argv.slice(2)
  const cmd = args[0]

  if (!cmd || cmd === '--help' || cmd === '-h') {
    printHelp()
    process.exit(0)
  }

  const config = loadConfig(root)

  switch (cmd) {
    case 'init': {
      await initAsync()
      break
    }
    case 'update': {
      const result = update(root, config)
      if (result.updated) {
        console.log('[docs-index-keeper] Added to', config.indexFile + ':', result.added.map((r) => r.path).join(', '))
      }
      break
    }
    case 'check': {
      const ok = check(root, config)
      if (!ok) {
        console.error('[docs-index-keeper] Index is out of date. Stage new docs and run "docs-index-keeper update", or add them manually to', config.indexFile)
        process.exit(1)
      }
      break
    }
    case 'add': {
      const pathArgs = args.slice(1)
      if (!pathArgs.length) {
        console.error('[docs-index-keeper] add requires one or more paths/masks. Example: docs-index-keeper add docs/my-doc.md docs/plans/*.md')
        process.exit(1)
      }
      const indexPath = join(root, config.indexFile)
      if (!existsSync(indexPath)) {
        console.error('[docs-index-keeper] Index file not found:', config.indexFile)
        process.exit(1)
      }
      const resolvedPaths = resolveAddInputs(root, pathArgs)
      if (!resolvedPaths.length) {
        console.error('[docs-index-keeper] No files matched the provided paths/masks')
        process.exit(1)
      }

      let readme = readFileSync(indexPath, 'utf-8')
      const existing = parseTable(readme)
      const existingPaths = new Set(existing.map((r) => r.path))
      const toAdd = []
      const skipped: string[] = []

      for (const pathArg of resolvedPaths) {
        const fullPath = join(root, pathArg)
        if (!existsSync(fullPath)) {
          skipped.push(`${pathArg} (not found)`)
          continue
        }
        if (!statSync(fullPath).isFile()) {
          skipped.push(`${pathArg} (not a file)`)
          continue
        }
        if (!pathArg.endsWith('.md')) {
          skipped.push(`${pathArg} (not a Markdown file)`)
          continue
        }

        const rel = pathArg.startsWith(config.docsDir + '/') ? pathArg.replace(new RegExp(`^${config.docsDir}/`), '') : pathArg
        if (config.exclude.some((e) => rel === e || rel.startsWith(e))) {
          skipped.push(`${pathArg} (excluded)`)
          continue
        }
        if (existingPaths.has(rel)) {
          skipped.push(`${pathArg} (already indexed)`)
          continue
        }

        const title = rel.replace(/\.md$/, '')
        const purpose = getFirstHeading(root, pathArg) || title.replace(/-/g, ' ')
        toAdd.push({ path: rel, title, purpose })
        existingPaths.add(rel)
      }

      if (!toAdd.length) {
        console.log('[docs-index-keeper] No new files were added')
        if (skipped.length) {
          console.log('[docs-index-keeper] Skipped:', skipped.join(', '))
        }
        break
      }

      readme = insertRows(readme, toAdd)
      writeFileSync(indexPath, readme)
      console.log('[docs-index-keeper] Added to', config.indexFile + ':', toAdd.map((row) => row.path).join(', '))
      if (skipped.length) {
        console.log('[docs-index-keeper] Skipped:', skipped.join(', '))
      }
      break
    }
    default:
      console.error('[docs-index-keeper] Unknown command:', cmd)
      printHelp()
      process.exit(1)
  }
}

main().catch((err) => {
  console.error('[docs-index-keeper]', err)
  process.exit(1)
})
