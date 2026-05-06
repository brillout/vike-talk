import type React from 'react'

export function Reveal({ children }: { children: React.ReactNode }) {
  return <span className="reveal">{children}</span>
}
