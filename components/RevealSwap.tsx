export { RevealSwap }

import type React from 'react'
import { Children } from 'react'
import './RevealSwap.css'

function RevealSwap({ children }: { children: React.ReactNode }) {
  const [initial, replacement] = Children.toArray(children).filter((c) => typeof c !== 'string' || c.trim() !== '')
  return (
    <div className="reveal-swap" style={{ display: 'grid', alignItems: 'start' }}>
      <div className="reveal-swap-initial" style={{ gridArea: '1 / 1' }}>
        {initial}
      </div>
      <div className="reveal-swap-replacement" style={{ gridArea: '1 / 1' }}>
        {replacement}
      </div>
    </div>
  )
}
