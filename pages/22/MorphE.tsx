import { motion } from 'motion/react'

const DURATION = 0.5
const EASE = [0.7, 0, 0.3, 1] as const

export function MorphE({ revealed, delayIn = 0, delayOut = 0 }: { revealed: boolean; delayIn?: number; delayOut?: number }) {
  return (
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
        transition={{ duration: DURATION, ease: EASE, delay: revealed ? delayIn : delayOut }}
      >
        <span style={{ display: 'block', lineHeight: 1 }}>E</span>
        <span style={{ display: 'block', lineHeight: 1 }}>e</span>
      </motion.span>
    </span>
  )
}
