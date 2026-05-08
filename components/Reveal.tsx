import type React from 'react'

export function Reveal({
  children,
  hideAfter,
  as,
  style,
  className,
}: {
  children: React.ReactNode
  hideAfter?: boolean
  as?: 'span' | 'div'
  style?: React.CSSProperties
  className?: string
}) {
  const Tag: React.ElementType = as ?? 'span'
  const base = hideAfter ? 'reveal-hide' : 'reveal'
  return (
    <Tag className={className ? `${base} ${className}` : base} style={style}>
      {children}
    </Tag>
  )
}
