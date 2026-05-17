import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { useEffect, useMemo } from 'react'
import { interpolate } from 'flubber/index.js'

// Hand-drawn approximations: capital E and lowercase e on a 100×100 viewBox.
// The two paths intentionally share similar topology so Flubber's interpolation
// reads as "the top half of E curls around to form the bowl of e".
const E_PATH =
  'M 8 8 L 78 8 L 78 22 L 24 22 L 24 42 L 60 42 L 60 56 L 24 56 L 24 76 L 78 76 L 78 90 L 8 90 Z'
const E_LOWER_PATH =
  'M 50 28 C 28 28, 12 44, 12 60 C 12 80, 30 92, 50 92 C 64 92, 76 86, 82 76 L 67 70 C 64 75, 58 78, 50 78 C 38 78, 28 72, 28 62 L 84 62 L 84 60 C 84 44, 70 28, 50 28 Z'

const MORPH_DURATION = 0.5
const MORPH_EASE = [0.7, 0, 0.3, 1] as const

export function MorphE({ revealed, delayIn = 0, delayOut = 0 }: { revealed: boolean; delayIn?: number; delayOut?: number }) {
  const t = useMotionValue(revealed ? 1 : 0)
  const morphFn = useMemo(() => interpolate(E_PATH, E_LOWER_PATH, { maxSegmentLength: 2 }), [])
  const d = useTransform(t, morphFn)

  useEffect(() => {
    const controls = animate(t, revealed ? 1 : 0, {
      duration: MORPH_DURATION,
      ease: MORPH_EASE,
      delay: revealed ? delayIn : delayOut,
    })
    return () => controls.stop()
  }, [revealed, delayIn, delayOut, t])

  return (
    <svg
      viewBox="0 0 96 100"
      preserveAspectRatio="xMidYMax meet"
      style={{
        display: 'inline-block',
        width: '0.7em',
        height: '0.78em',
        verticalAlign: 'baseline',
      }}
    >
      <motion.path d={d} fill="currentColor" />
    </svg>
  )
}
