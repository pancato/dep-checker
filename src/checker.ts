import fs from 'node:fs/promises'
import ansis from 'ansis'
import fg from 'fast-glob'
import { findStaticImports } from 'mlly'
import { getDependencyNames, getPackageJson } from './utils'

export interface CheckResult {
  used: string[]
  unused: string[]
  all: string[]
}

export async function runCheck(
  projectDir: string,
  ignorePackages: string[] = [],
): Promise<CheckResult> {
  const pkg = await getPackageJson(projectDir)
  const allDeps = getDependencyNames(pkg)

  const files = await fg(['**/*.{js,ts,jsx,tsx,vue}', '!node_modules'], {
    cwd: projectDir,
    absolute: true,
  })

  const usedSet = new Set<string>()

  for (const file of files) {
    const content = await fs.readFile(file, 'utf-8')
    const imports = findStaticImports(content)

    imports.forEach((imp) => {
      const pkgName = imp.specifier
      if (allDeps.includes(pkgName) && !pkgName.startsWith('.')) {
        usedSet.add(pkgName)
      }
    })
  }

  const used = Array.from(usedSet)
  const unused = allDeps.filter(dep =>
    !used.includes(dep) && !ignorePackages.includes(dep),
  )

  return {
    used,
    unused,
    all: allDeps,
  }
}

export function printResults(results: CheckResult): void {
  const { used, unused, all } = results

  console.log(ansis.bold.green(`\n依赖检测完成!`))
  console.log(ansis.cyan(`总依赖数: ${all.length}`))
  console.log(ansis.green(`已使用: ${used.length}`))

  if (unused.length > 0) {
    console.log(ansis.bold.red(`\n未使用的依赖 (${unused.length}):`))
    unused.forEach(name => console.log(ansis.red(`- ${name}`)))
  }
  else {
    console.log(ansis.bold.green('\n没有发现未使用的依赖!'))
  }
}
