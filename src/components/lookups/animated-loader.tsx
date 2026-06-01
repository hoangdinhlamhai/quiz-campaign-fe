import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

const INCANTATIONS = [
  'Đang đối chiếu sơ đồ tinh tú...',
  'Đang phân tích dòng chảy năng lượng...',
  'Đang liên kết nhịp đập nhân duyên...',
  'Đang giải mã con số vận mệnh...',
  'Đang tổng hợp kết quả...',
]

export function AnimatedLoader() {
  const [percent, setPercent] = useState(0)
  const [lineIdx, setLineIdx] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent((p) => Math.min(p + 1, 100))
    }, 25)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setLineIdx((i) => (i + 1) % INCANTATIONS.length)
    }, 600)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm">
      <motion.div
        className="relative mb-8 h-32 w-32"
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      >
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke="hsl(141 74% 42%)"
            strokeWidth="2"
            strokeDasharray="8 4"
            opacity="0.6"
          />
          <circle
            cx="50" cy="50" r="35"
            fill="none"
            stroke="hsl(141 74% 42%)"
            strokeWidth="1.5"
            strokeDasharray="4 6"
            opacity="0.4"
          />
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <circle
              key={angle}
              cx={50 + 40 * Math.cos((angle * Math.PI) / 180)}
              cy={50 + 40 * Math.sin((angle * Math.PI) / 180)}
              r="2"
              fill="hsl(141 74% 42%)"
            />
          ))}
        </svg>
      </motion.div>

      <motion.span
        className="mb-4 text-4xl font-bold text-accent"
        key={percent}
      >
        {percent}%
      </motion.span>

      <div className="h-8">
        <AnimatePresence mode="wait">
          <motion.p
            key={lineIdx}
            className="text-center text-sm text-muted"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {INCANTATIONS[lineIdx]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  )
}
