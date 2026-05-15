export { Quote }

import type React from 'react'
import { Center } from './Center'
import { Reveal } from './Reveal'

function Quote({
  quote,
  author,
  reveal,
  quoteStyle,
  children,
}: {
  quote: React.ReactNode
  author: React.ReactNode
  reveal?: boolean
  quoteStyle?: React.CSSProperties
  children?: React.ReactNode
}) {
  const authorEl = <div style={{ marginTop: 36, fontStyle: 'italic', color: '#666' }}>— {author}</div>
  return (
    <Center style={{ flexDirection: 'column' }}>
      <div
        style={{
          position: 'relative',
          fontSize: '1.6em',
          fontWeight: 700,
          textAlign: 'center',
          lineHeight: 1.25,
          maxWidth: '20em',
          ...quoteStyle,
        }}
      >
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '-0.55em',
            left: '-0.6em',
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: '3em',
            lineHeight: 1,
            color: '#e3e6ea',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          “
        </span>
        {quote}
      </div>
      {reveal ? <Reveal as="div">{authorEl}</Reveal> : authorEl}
      {children}
    </Center>
  )
}
