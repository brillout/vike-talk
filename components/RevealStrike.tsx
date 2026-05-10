export { RevealStrike }

import type React from 'react'
import './RevealStrike.css'

function RevealStrike({ children }: { children: React.ReactNode }) {
  return <span className="reveal-strike">{children}</span>
}
