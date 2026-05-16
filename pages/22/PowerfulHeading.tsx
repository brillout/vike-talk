import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { getCurrentStep } from '../../utils/reveal'

const STEP = 1

export function PowerfulHeading() {
  const ref = useRef<HTMLSpanElement>(null)
  const [revealed, setRevealed] = useState(() => {
    if (typeof window === 'undefined') return false
    return getCurrentStep() >= STEP
  })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const sync = () => setRevealed(el.dataset.revealed === 'true')
    sync()
    const observer = new MutationObserver(sync)
    observer.observe(el, { attributes: true, attributeFilter: ['data-revealed'] })
    return () => observer.disconnect()
  }, [])

  return (
    <h1 style={{ display: 'grid', gridTemplateColumns: 'auto auto', width: 'max-content', margin: '0 auto 25px' }}>
      <motion.span
        ref={ref}
        className="reveal"
        initial={false}
        animate={{ x: revealed ? 0 : -40, opacity: revealed ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 24, mass: 0.7 }}
      >
        Powerful&nbsp;
      </motion.span>
      <span>extensions</span>
    </h1>
  )
}
