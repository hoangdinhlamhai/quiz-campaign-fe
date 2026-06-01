import { motion } from 'framer-motion'

export function GaugeSection({ percent, headline, summary }: { percent: number; headline: string; summary: string }) {
  const color = percent >= 80 ? 'var(--lv-from)' : percent >= 70 ? 'var(--lv-via)' : 'var(--lv-to)'
  return (
    <section className="relative mb-8 overflow-hidden rounded-3xl p-8 text-center glow-border" style={{ background: 'var(--lv-soft)' }}>
      <div className="absolute inset-0 bg-hero-gradient opacity-20" />
      <div className="particles" />
      <div className="relative">
        <p className="mb-4 text-sm text-muted">💕 Mức Độ Tương Hợp</p>
        <div className="flex justify-center">
          <motion.div
            className="relative flex h-28 w-28 items-center justify-center"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg viewBox="0 0 24 24" className="h-24 w-24 drop-shadow-lg" style={{ fill: color }}>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span className="absolute text-lg font-bold text-white drop-shadow">{percent}%</span>
          </motion.div>
        </div>
        <div className="mx-auto mt-6 max-w-md rounded-2xl border border-border bg-surface-glass p-5">
          <p className="mb-2 text-sm font-semibold lv-gradient-text">{headline}</p>
          <p className="text-sm leading-relaxed text-muted">{summary}</p>
        </div>
      </div>
    </section>
  )
}
