export { config }
export type { Sections }

import vikeReact from 'vike-react/config'
import type { Config } from 'vike/types'

const config = {
  title: 'Vike Talk',
  meta: {
    sections: {
      env: { client: true, server: true },
    },
  },
  extends: vikeReact,
} satisfies Config

declare global {
  namespace Vike {
    interface Config {
      sections?: Sections
    }
  }
}

type Sections = { name: string; numberOfSlides: number }[]
