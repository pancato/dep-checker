import fs from 'node:fs/promises'
import path from 'node:path'
import { execa } from 'execa'

interface PackageJson {
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  [key: string]: any
}

export async function getPackageJson(projectDir: string): Promise<PackageJson> {
  const pkgPath = path.join(projectDir, 'package.json')
  const content = await fs.readFile(pkgPath, 'utf-8')
  return JSON.parse(content)
}

export function getDependencyNames(pkg: PackageJson): string[] {
  const deps = Object.keys(pkg.dependencies || {})
  // const devDeps = Object.keys(pkg.devDependencies || {})
  return [...deps]
}

export async function removeDependency(packages: string[]): Promise<void> {
  const args = ['remove', ...packages]
  await execa('npm', args, { stdio: 'inherit' })
}

export function formatList(items: string[]): string {
  return items.map(item => `• ${item}`).join('\n')
}
