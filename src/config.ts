import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

export interface DocsIndexKeeperConfig {
  indexFile: string
  docsDir: string
  exclude: string[]
  allowedRootMd: string[]
  warnRootMd: boolean
}

const DEFAULT: DocsIndexKeeperConfig = {
  indexFile: 'docs/README.md',
  docsDir: 'docs',
  exclude: ['README.md', 'archive/'],
  allowedRootMd: ['README.md', 'AGENTS.md', 'CONTRIBUTING.md', 'RENDER_DEPLOY.md', 'ENV_CHECKLIST.md', 'MIGRATION.md'],
  warnRootMd: true,
}

export function loadConfig(root: string): DocsIndexKeeperConfig {
  const pkgPath = join(root, 'package.json')
  if (existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8')) as Record<string, unknown>
      const cfg = pkg.docsIndexKeeper as Partial<DocsIndexKeeperConfig> | undefined
      if (cfg && typeof cfg === 'object') {
        return { ...DEFAULT, ...cfg }
      }
    } catch {
      // fall through to defaults
    }
  }

  const rcPaths = ['.docs-index-keeper.json', '.docsindexkeeperrc.json']
  for (const rc of rcPaths) {
    const p = join(root, rc)
    if (existsSync(p)) {
      try {
        const cfg = JSON.parse(readFileSync(p, 'utf-8')) as Partial<DocsIndexKeeperConfig>
        return { ...DEFAULT, ...cfg }
      } catch {
        break
      }
    }
  }

  return { ...DEFAULT }
}
