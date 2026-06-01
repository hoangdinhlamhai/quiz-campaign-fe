import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect, useState } from 'react'

interface ScoreRevealProps {
  value: number
  max?: number
  suffix?: string
  label?: string
  duration?: number
}

export function ScoreReveal({ value, max = 100, suffix = '', label, duration = 1.5 }: ScoreRevealProps) {
  const motionVal = useMotionValue(0)
  const rounded = useTransform(motionVal, (v) => Math.round(v))
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const controls = animate(motionVal, value, { duration, ease: 'easeOut' })
    const unsub = rounded.on('change', (v) => setDisplay(v))
    return () => { controls.stop(); unsub() }
  }, [value, duration, motionVal, rounded])

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div
        className="relative flex items-center justify-center"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <motion.div
          className="absolute h-32 w-32 rounded-full bg-accent/20"
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span className="relative text-5xl font-bold text-accent">
          {display}{suffix}
        </span>
      </motion.div>
      {label && <p className="text-sm text-muted">{label}</p>}
      {max !== 100 && (
        <p className="text-xs text-muted">/ {max}</p>
      )}
    </div>
  )
}
