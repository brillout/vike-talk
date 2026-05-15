export { Illustration }
export type { Framework }

import type React from 'react'
import { Reveal } from '../components/Reveal'
import './7/Illustration.css'
import lightningIcon from './1/usps/usp-lightning-dx.svg'
import freedomIcon from './1/usps/usp-freedom.svg'
import stabilityIcon from './1/usps/usp-stability.svg'

type Framework = {
  key: string
  names: string[]
  values: Record<string, number>
  tinted?: boolean
  /** 0-based position within the 4-slot spectrum (0 = leftmost, 3 = rightmost). Defaults to array index. */
  colIndex?: number
}
type Criterion = { key: string; label: string; icon: string }

const defaultFrameworks: Framework[] = [
  { key: 'vps', names: ['vite-plugin-ssr'], values: { batteries: 20, flex: 92, stable: 92 }, tinted: true },
  { key: 'rrts', names: ['React Router', 'TanStack Start'], values: { batteries: 35, flex: 50, stable: 50 } },
  { key: 'next', names: ['Next.js'], values: { batteries: 50, flex: 40, stable: 40 } },
  { key: 'redwood', names: ['Redwood'], values: { batteries: 70, flex: 10, stable: 10 } },
]

const criteria: Criterion[] = [
  { key: 'batteries', label: 'Batteries included', icon: lightningIcon },
  { key: 'flex', label: 'Freedom', icon: freedomIcon },
  { key: 'stable', label: 'Stability', icon: stabilityIcon },
]

const TRACK_COLOR = '#e6e8eb'
const BAND_COLOR = '#f6f7f8'
const TINT = 'rgba(0, 176, 165, 0.09)'

const RED = '#ef4444'
const GREEN = '#10b981'

function barColor(value: number): string {
  if (value < 33) return RED
  if (value < 67) return '#f59e0b' // orange
  return GREEN
}

function Illustration({
  allRevealed = false,
  frameworks = defaultFrameworks,
}: {
  allRevealed?: boolean
  frameworks?: Framework[]
} = {}) {
  // Always render 4 spectrum slots so the axis line and dot positions stay
  // consistent across variants. Custom frameworks pick their slot via `colIndex`;
  // unfilled slots are empty space.
  const TOTAL_COLS = 4
  const half = TOTAL_COLS / 2
  const lastCol = TOTAL_COLS + 2
  const colWidth = `calc((min(95vw, 1700px) - 240px) / ${TOTAL_COLS})`
  const placed = frameworks.map((f, i) => ({ ...f, colIdx: f.colIndex ?? i }))
  const indicators: { side: 'left' | 'right'; col: string; row: number; mark: string; color: string }[] = [
    { side: 'left', col: `2 / ${2 + half}`, row: 3, mark: '✗', color: RED },
    { side: 'left', col: `2 / ${2 + half}`, row: 4, mark: '✓', color: GREEN },
    { side: 'left', col: `2 / ${2 + half}`, row: 5, mark: '✓', color: GREEN },
    { side: 'right', col: `${2 + half} / ${lastCol}`, row: 3, mark: '✓', color: GREEN },
    { side: 'right', col: `${2 + half} / ${lastCol}`, row: 4, mark: '✗', color: RED },
    { side: 'right', col: `${2 + half} / ${lastCol}`, row: 5, mark: '✗', color: RED },
  ]
  return (
    <div
      style={{
        width: 'min(95vw, 1700px)',
        marginLeft: 'calc(50% - min(47.5vw, 850px))',
        marginRight: 'calc(50% - min(47.5vw, 850px))',
        marginTop: 30,
        fontSize: '0.7em',
        display: 'grid',
        gridTemplateColumns: `auto repeat(${TOTAL_COLS}, ${colWidth})`,
        gridTemplateRows: 'auto auto repeat(3, 60px)',
      }}
    >
      <AxisRow lastCol={lastCol} />

      {criteria.map((c, i) => {
        const rowStyle: React.CSSProperties = {
          gridColumn: '1 / -1',
          gridRow: i + 3,
          display: 'grid',
          gridTemplateColumns: 'subgrid',
          background: i % 2 === 0 ? BAND_COLOR : 'transparent',
        }
        const rowContent = (
          <>
            <div
              style={{
                gridColumn: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                paddingLeft: 14,
                paddingRight: 28,
                fontWeight: 600,
                whiteSpace: 'nowrap',
              }}
            >
              <img src={c.icon} alt="" style={{ width: 30, height: 30, flexShrink: 0 }} />
              <span>{c.label}</span>
            </div>
            {!allRevealed &&
              indicators
                .filter((ind) => ind.row === i + 3)
                .map((ind, j) => (
                  <div
                    key={`ind-${j}`}
                    className={`indicator-${ind.side}`}
                    style={{
                      gridColumn: ind.col,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.6em',
                      fontWeight: 700,
                      color: ind.color,
                    }}
                  >
                    {ind.mark}
                  </div>
                ))}
          </>
        )
        return allRevealed ? (
          <div key={`row-${c.key}`} style={rowStyle}>
            {rowContent}
          </div>
        ) : (
          <Reveal key={`row-${c.key}`} as="div" style={rowStyle}>
            {rowContent}
          </Reveal>
        )
      })}

      {[...placed].reverse().map((f) => {
        const colIdx = f.colIdx
        const wrapperClassName = `framework-${f.key}`
        const wrapperStyle = {
          gridColumn: colIdx + 2,
          gridRow: '2 / 6',
          display: 'grid',
          gridTemplateRows: 'subgrid',
          position: 'relative',
        } as const
        const content = (
          <>
            {f.tinted && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: TINT,
                  pointerEvents: 'none',
                }}
              />
            )}
            <div
              style={{
                position: 'absolute',
                top: -19,
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: '#444',
                pointerEvents: 'none',
              }}
            />
            <NameCell names={f.names} />
            {criteria.map((c) => (
              <BarCell key={c.key} value={f.values[c.key]} />
            ))}
          </>
        )
        return allRevealed ? (
          <div key={f.key} className={wrapperClassName} style={wrapperStyle}>
            {content}
          </div>
        ) : (
          <Reveal key={f.key} as="div" className={wrapperClassName} style={wrapperStyle}>
            {content}
          </Reveal>
        )
      })}
    </div>
  )
}

function NameCell({ names }: { names: string[] }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        fontWeight: 600,
        lineHeight: 1.2,
        padding: '6px 0 14px',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {names.map((n) => (
        <div key={n}>{n}</div>
      ))}
    </div>
  )
}

function AxisRow({ lastCol }: { lastCol: number }) {
  return (
    <div style={{ gridColumn: `2 / ${lastCol}`, gridRow: 1, padding: '0 0 18px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontStyle: 'italic',
          color: '#666',
          marginBottom: 8,
          padding: '0 14px',
        }}
      >
        <span>← Unopinionated</span>
        <span>Opinionated →</span>
      </div>
      <div style={{ height: 2, background: '#bbb' }} />
    </div>
  )
}

function BarCell({ value }: { value: number }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 11,
          background: TRACK_COLOR,
          borderRadius: 6,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: '50%',
            width: 1,
            background: '#7a8189',
            opacity: 0.45,
            zIndex: 1,
          }}
        />
        <div
          style={{
            width: `${value}%`,
            height: '100%',
            background: barColor(value),
            borderRadius: 6,
          }}
        />
      </div>
    </div>
  )
}
