import { motion } from 'motion/react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { getCurrentStep } from '../../utils/reveal'

const STEP = 1
const MOVE = { type: 'spring' as const, stiffness: 220, damping: 26, mass: 0.7 }
const CROSSFADE = { duration: 0.25, ease: 'easeOut' as const }

export function PowerfulHeading() {
  const powerfulRef = useRef<HTMLSpanElement>(null)
  const [revealed, setRevealed] = useState(() => {
    if (typeof window === 'undefined') return false
    return getCurrentStep() >= STEP
  })
  const [powerfulWidth, setPowerfulWidth] = useState(0)

  useEffect(() => {
    const el = powerfulRef.current
    if (!el) return
    const sync = () => setRevealed(el.dataset.revealed === 'true')
    sync()
    const observer = new MutationObserver(sync)
    observer.observe(el, { attributes: true, attributeFilter: ['data-revealed'] })
    return () => observer.disconnect()
  }, [])

  useLayoutEffect(() => {
    const el = powerfulRef.current
    if (!el) return
    const measure = () => setPowerfulWidth(el.getBoundingClientRect().width)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const extensionsShift = revealed ? 0 : -powerfulWidth / 2

  return (
    <h1 style={{ display: 'grid', gridTemplateColumns: 'auto auto', width: 'max-content', margin: '0 auto 25px' }}>
      <motion.span
        ref={powerfulRef}
        className="reveal"
        initial={false}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ duration: 0.35, ease: 'easeOut', delay: revealed ? 0.4 : 0 }}
      >
        Powerful&nbsp;
      </motion.span>
      <motion.span
        initial={false}
        animate={{ x: extensionsShift }}
        transition={{ ...MOVE, delay: revealed ? 0 : 0.25 }}
        style={{ display: 'inline-block' }}
      >
        <span style={{ position: 'relative', display: 'inline-block' }}>
          <motion.span
            initial={false}
            animate={{ opacity: revealed ? 0 : 1 }}
            transition={{ ...CROSSFADE, delay: revealed ? 0 : 0.25 }}
          >
            E
          </motion.span>
          <motion.span
            style={{ position: 'absolute', left: 0, top: 0 }}
            initial={false}
            animate={{ opacity: revealed ? 1 : 0 }}
            transition={{ ...CROSSFADE, delay: revealed ? 0 : 0.25 }}
          >
            e
          </motion.span>
        </span>
        xtensions
      </motion.span>
    </h1>
  )
}
