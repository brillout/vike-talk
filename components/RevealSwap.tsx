export { RevealSwap }

import type React from 'react'
import { Children } from 'react'
import { Reveal } from './Reveal'

function RevealSwap({ children }: { children: React.ReactNode }) {
  const [initial, replacement] = Children.toArray(children).filter((c) => typeof c !== 'string' || c.trim() !== '')
  return (
    <div style={{ display: 'grid', alignItems: 'start' }}>
      <div style={{ gridArea: '1 / 1' }}>
        <Reveal hideAfter as="div">
          {initial}
        </Reveal>
      </div>
      <div style={{ gridArea: '1 / 1' }}>
        <Reveal as="div">{replacement}</Reveal>
      </div>
    </div>
  )
}
