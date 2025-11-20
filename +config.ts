export { config }
export type { Sections }

import vikeReact from 'vike-react/config'
import type { Config } from 'vike/types'

const config = {
  title: 'Vike Talk',
  prerender: {
    noExtraDir: true,
  },
  meta: {
    sections: {
      global: true,
      env: { client: true, server: true },
    },
    fullscreen: {
      env: { client: true, server: true },
    },
  },
  extends: vikeReact,
} satisfies Config

declare global {
  namespace Vike {
    interface Config {
      sections?: Sections
      fullscreen?: boolean
    }
  }
}

type Sections = { name: string; numberOfSlides: number }[]
