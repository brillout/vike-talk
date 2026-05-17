import { gsap } from 'gsap'
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { E_LOWER_PATH, E_PATH } from './inter-glyphs'

if (typeof window !== 'undefined') gsap.registerPlugin(MorphSVGPlugin)

const DURATION = 0.55
const EASE = 'power3.inOut'

export function MorphE({ revealed, delayIn = 0, delayOut = 0 }: { revealed: boolean; delayIn?: number; delayOut?: number }) {
  const pathRef = useRef<SVGPathElement>(null)
  const isFirstRun = useRef(true)

  // Set initial d once before the morph effect runs.
  useLayoutEffect(() => {
    const el = pathRef.current
    if (!el) return
    el.setAttribute('d', revealed ? E_LOWER_PATH : E_PATH)
  }, [])

  useEffect(() => {
    const el = pathRef.current
    if (!el) return
    if (isFirstRun.current) {
      isFirstRun.current = false
      return
    }
    const target = revealed ? E_LOWER_PATH : E_PATH
    const tween = gsap.to(el, {
      morphSVG: { shape: target, type: 'rotational', shapeIndex: 'auto' },
      duration: DURATION,
      ease: EASE,
      delay: revealed ? delayIn : delayOut,
      onComplete: () => el.setAttribute('d', target),
    })
    return () => {
      tween.kill()
    }
  }, [revealed, delayIn, delayOut])

  return (
    <svg
      data-revealed={String(revealed)}
      viewBox="0 -75 56 75"
      style={{
        display: 'inline-block',
        height: '0.75em',
        width: '0.56em',
        verticalAlign: 'baseline',
      }}
    >
      <path ref={pathRef} fill="currentColor" />
    </svg>
  )
}
