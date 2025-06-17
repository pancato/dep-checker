import prompts from '@posva/prompts'
import ansis from 'ansis'
import { removeDependency } from './utils'

export async function handlePrompts(results: any): Promise<void> {
  const { unused } = results

  if (unused.length === 0)
    return

  const { action } = await prompts({
    type: 'select',
    name: 'action',
    message: '发现未使用的依赖:',
    choices: [
      { title: '显示详情', value: 'show' },
      { title: '移除未使用的依赖', value: 'remove' },
      { title: '退出', value: 'exit' },
    ],
  })

  if (action === 'show') {
    console.log(ansis.bold('\n未使用的依赖:'))
    unused.forEach((dep: string) => console.log(`- ${dep}`))
  }
  else if (action === 'remove') {
    const { packagesToRemove } = await prompts({
      type: 'multiselect',
      name: 'packagesToRemove',
      message: '选择要移除的依赖:',
      choices: unused.map((dep: string) => ({
        title: dep,
        value: dep,
        selected: true,
      })),
    })

    if (packagesToRemove.length > 0) {
      await removeDependency(packagesToRemove)
      console.log(ansis.green(`\n已移除 ${packagesToRemove.length} 个依赖!`))
    }
  }
}
