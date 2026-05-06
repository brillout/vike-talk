import mdx from '@mdx-js/rollup'
import react from '@vitejs/plugin-react-swc'
import vike from 'vike/plugin'
import { UserConfig } from 'vite'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkGfm from 'remark-gfm'
import { transformerNotationDiff, transformerNotationWordHighlight } from '@shikijs/transformers'
// @brillout/shiki-transformers adds color parameter `[!code highlight:#abc]` where #abc is a color
// https://github.com/shikijs/shiki/issues/1264
// https://shiki.style/packages/transformers#transformernotationhighlight
// https://github.com/shikijs/shiki/compare/main...brillout:shiki:brillout/highlight-color-param
import { transformerNotationHighlight } from '@brillout/shiki-transformers'

const root = process.cwd()
const prettyCode = [
  rehypePrettyCode,
  {
    theme: 'github-light',
    transformers: [transformerNotationDiff(), transformerNotationHighlight(), transformerNotationWordHighlight()],
  },
]
const rehypePlugins: any = [prettyCode]
const remarkPlugins = [remarkGfm]

const config: UserConfig = {
  root,
  plugins: [
    mdx({ rehypePlugins, remarkPlugins, providerImportSource: '@mdx-js/react' }),
    // @vitejs/plugin-react-swc needs to be added *after* the mdx plugins
    react(),
    vike(),
  ],
  optimizeDeps: { include: ['@mdx-js/react', 'react-dom'] },
  // @ts-ignore
  ssr: {
    noExternal: ['@brillout/docpress'],
  },
  clearScreen: false,
}

export default config
