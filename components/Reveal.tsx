import type React from 'react'

export function Reveal({
  children,
  hideAfter,
  as,
}: {
  children: React.ReactNode
  hideAfter?: boolean
  as?: 'span' | 'div'
}) {
  const Tag: React.ElementType = as ?? 'span'
  return <Tag className={hideAfter ? 'reveal-hide' : 'reveal'}>{children}</Tag>
}
