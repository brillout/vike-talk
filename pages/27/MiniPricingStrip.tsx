export { MiniPricingStrip }

import React from 'react'

const gradients = {
  green: 'linear-gradient(135deg, #00955f, #00b0a5)',
  blue: 'linear-gradient(135deg, #7F5AF0, #3B82F6)',
}

const columns = [
  {
    title: 'Small team',
    subtitle: '',
    price: 'Free',
    toneBg: 'linear-gradient(180deg, rgba(16,185,129,0.14), rgba(16,185,129,0.06), rgba(255,255,255,0.7))',
    panelBg: 'rgba(236,253,245,0.65)',
    priceColor: 'green' as const,
    suffix: undefined as string | undefined,
  },
  {
    title: 'Larger team',
    subtitle: 'LOW RESOURCES',
    price: 'Free',
    toneBg: 'linear-gradient(180deg, rgba(16,185,129,0.14), rgba(16,185,129,0.06), rgba(255,255,255,0.7))',
    panelBg: 'rgba(236,253,245,0.65)',
    priceColor: 'green' as const,
    suffix: undefined as string | undefined,
  },
  {
    title: 'Larger team',
    subtitle: 'HIGH RESOURCES',
    price: '$5k',
    toneBg: 'linear-gradient(180deg, rgba(59,130,246,0.16), rgba(139,92,246,0.08), rgba(255,255,255,0.7))',
    panelBg: 'rgba(239,246,255,0.60)',
    priceColor: 'blue' as const,
    suffix: 'ONE TIME' as string | undefined,
  },
]

function MiniPricingStrip() {
  return (
    <div
      style={{
        margin: '0 auto',
        width: '100%',
        maxWidth: 600,
        overflow: 'hidden',
        borderRadius: '1.6rem',
        border: '1px solid rgba(255,255,255,0.8)',
        background: 'rgba(255,255,255,0.88)',
        boxShadow: '0 24px 70px rgba(15,23,42,0.08)',
        outline: '1px solid rgba(203,213,225,0.4)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.95), rgba(248,250,252,0.9))',
        }}
      >
        {columns.map((col, i) => (
          <div
            key={`${col.title}-${col.subtitle}`}
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 168,
              padding: '28px 24px',
              textAlign: 'center',
              background: col.panelBg,
              borderLeft: i > 0 ? '1px solid rgba(203,213,225,0.7)' : undefined,
            }}
          >
            {/* gradient tone overlay */}
            <div style={{ position: 'absolute', inset: 0, background: col.toneBg, pointerEvents: 'none' }} />

            <div
              style={{
                position: 'relative',
                fontSize: '0.9rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                color: '#64748b',
                minHeight: '2.8rem',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {col.title}
            </div>
            <div
              style={{
                position: 'relative',
                fontSize: '0.67rem',
                fontWeight: 500,
                letterSpacing: '0.16em',
                color: '#94a3b8',
                minHeight: '1.15rem',
                lineHeight: '1.15rem',
              }}
            >
              {col.subtitle || '\u00A0'}
            </div>
            <div
              style={{
                position: 'relative',
                marginTop: 20,
                fontSize: '2rem',
                fontWeight: 600,
                letterSpacing: '-0.03em',
              }}
            >
              <span
                style={{
                  background: gradients[col.priceColor],
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {col.price}
              </span>
            </div>
            <div
              style={{
                position: 'relative',
                marginTop: 4,
                fontSize: '0.66rem',
                fontWeight: 500,
                letterSpacing: '0.16em',
                color: '#64748b',
                minHeight: '2rem',
                display: 'flex',
                alignItems: 'flex-start',
              }}
            >
              {col.suffix || '\u00A0'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
