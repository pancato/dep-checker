import type { CAC } from 'cac'
import process from 'node:process'
import cac from 'cac'
import pkgJson from '../package.json'
import { runCheck } from './checker'
import { handlePrompts } from './prompts'

const cli: CAC = cac('dep-checker')

cli.version(pkgJson.version)

cli
  .command('check', '检查未使用的依赖')
  .option('-d, --dir <dir>', '项目目录', { default: process.cwd() })
  .option('-i, --ignore <names>', '忽略的包名（逗号分隔）')
  .action(async (options) => {
    const { dir, ignore } = options
    const ignorePackages = ignore?.split(',') || []
    // run check
    const results = await runCheck(dir, ignorePackages)

    await handlePrompts(results)
  })

cli.command('')
  .action(() => {
    cli.outputHelp()
  })

cli.help()
cli.parse()
