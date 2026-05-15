import type React from 'react'

export function Reveal({
  children,
  as,
  style,
  className,
}: {
  children: React.ReactNode
  as?: 'span' | 'div'
  style?: React.CSSProperties
  className?: string
}) {
  const Tag: React.ElementType = as ?? 'span'
  return (
    <Tag className={className ? `reveal ${className}` : 'reveal'} style={style}>
      {children}
    </Tag>
  )
}
