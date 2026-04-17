import { existsSync, readdirSync } from 'fs'
import { join } from 'path'

function hasGlobMask(input: string): boolean {
  return /[*?\[\]]/.test(input)
}

function escapeRegexChar(char: string): string {
  return /[\\^$+?.()|{}]/.test(char) ? `\\${char}` : char
}

function globMaskToRegex(mask: string): RegExp {
  let pattern = '^'
  for (let i = 0; i < mask.length; i++) {
    const char = mask[i]
    const next = mask[i + 1]
    if (char === '*' && next === '*') {
      pattern += '.*'
      i++
      continue
    }
    if (char === '*') {
      pattern += '[^/]*'
      continue
    }
    if (char === '?') {
      pattern += '[^/]'
      continue
    }
    pattern += escapeRegexChar(char)
  }
  pattern += '$'
  return new RegExp(pattern)
}

function collectFilesRecursively(baseDir: string, prefix = ''): string[] {
  if (!existsSync(baseDir)) return []
  const out: string[] = []
  for (const entry of readdirSync(baseDir, { withFileTypes: true })) {
    const relPath = prefix ? `${prefix}/${entry.name}` : entry.name
    const fullPath = join(baseDir, entry.name)
    if (entry.isDirectory()) {
      out.push(...collectFilesRecursively(fullPath, relPath))
      continue
    }
    if (entry.isFile()) out.push(relPath)
  }
  return out
}

export function resolveAddInputs(rootDir: string, inputs: string[]): string[] {
  const normalized = inputs.map((input) => input.replace(/\\/g, '/').trim()).filter(Boolean)
  const masks = normalized.filter(hasGlobMask)
  const directPaths = normalized.filter((input) => !hasGlobMask(input))
  if (!masks.length) return [...new Set(directPaths)]

  const files = collectFilesRecursively(rootDir).map((p) => p.replace(/\\/g, '/'))
  const expanded = masks.flatMap((mask) => {
    const regex = globMaskToRegex(mask)
    return files.filter((p) => regex.test(p))
  })
  return [...new Set([...directPaths, ...expanded])]
}
