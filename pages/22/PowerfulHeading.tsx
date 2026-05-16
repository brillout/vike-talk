import { motion } from 'motion/react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { getCurrentStep } from '../../utils/reveal'

const STEP = 1
const MOVE = { type: 'spring' as const, stiffness: 220, damping: 26, mass: 0.7 }
const SLOT = { duration: 0.5, ease: [0.7, 0, 0.3, 1] as const }

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
    <h1 style={{ display: 'grid', gridTemplateColumns: 'auto auto', width: 'max-content', margin: '0 auto 25px', lineHeight: 1 }}>
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
        <span
          style={{
            display: 'inline-block',
            overflow: 'hidden',
            verticalAlign: 'top',
            height: '1em',
            lineHeight: 1,
          }}
        >
          <motion.span
            style={{ display: 'block', lineHeight: 1 }}
            initial={false}
            animate={{ y: revealed ? '-1em' : '0em' }}
            transition={{ ...SLOT, delay: revealed ? 0 : 0.25 }}
          >
            <span style={{ display: 'block', lineHeight: 1 }}>E</span>
            <span style={{ display: 'block', lineHeight: 1 }}>e</span>
          </motion.span>
        </span>
        xtensions
      </motion.span>
    </h1>
  )
}
