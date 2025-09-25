import type { Config } from 'vike/types'
import vikeReact from 'vike-react/config'

export default {
  ...vikeReact,
  title: 'Vike Presentation',
  description: 'A presentation about Vike framework',
  extends: vikeReact
} satisfies Config
