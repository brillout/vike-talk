import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { interpolate } from 'flubber/index.js'
import { useEffect, useMemo } from 'react'
import { E_LOWER_PATH, E_PATH } from './inter-glyphs'

const DURATION = 0.55
const EASE = [0.7, 0, 0.3, 1] as const

export function MorphE({ revealed, delayIn = 0, delayOut = 0 }: { revealed: boolean; delayIn?: number; delayOut?: number }) {
  const t = useMotionValue(revealed ? 1 : 0)
  const morphFn = useMemo(() => interpolate(E_PATH, E_LOWER_PATH, { maxSegmentLength: 2 }), [])
  const d = useTransform(t, morphFn)

  useEffect(() => {
    const controls = animate(t, revealed ? 1 : 0, {
      duration: DURATION,
      ease: EASE,
      delay: revealed ? delayIn : delayOut,
    })
    return () => controls.stop()
  }, [revealed, delayIn, delayOut, t])

  return (
    <svg
      viewBox="0 -75 56 75"
      style={{
        display: 'inline-block',
        height: '0.75em',
        width: '0.56em',
        verticalAlign: 'baseline',
      }}
    >
      <motion.path d={d} fill="currentColor" />
    </svg>
  )
}
