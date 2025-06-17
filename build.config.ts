import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/cli',
  ],
  declaration: 'node16',
  clean: true,
  rollup: {
    esbuild: {
      minify: true,
    },
  },
})
