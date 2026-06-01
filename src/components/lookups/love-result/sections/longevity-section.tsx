import { motion } from 'framer-motion'

export function LongevitySection({ score, horizon, description }: { score: number; horizon: string; description: string }) {
  return (
    <section className="mb-8 rounded-2xl border border-border p-6 glow-border" style={{ background: 'var(--lv-soft)' }}>
      <div className="mb-4 flex items-center justify-center gap-2">
        <span className="text-lg">♾️</span>
        <h2 className="text-lg font-bold text-foreground">Độ Bền Mối Quan Hệ</h2>
      </div>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <div className="relative flex h-24 w-24 items-center justify-center">
          <svg viewBox="0 0 36 36" className="h-24 w-24 -rotate-90">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(260 15% 20%)" strokeWidth="3" />
            <motion.circle
              cx="18" cy="18" r="15.9" fill="none"
              stroke="var(--lv-accent)" strokeWidth="3" strokeLinecap="round"
              strokeDasharray="100"
              initial={{ strokeDashoffset: 100 }}
              animate={{ strokeDashoffset: 100 - score }}
              transition={{ duration: 1 }}
            />
          </svg>
          <span className="absolute text-lg font-bold text-foreground">{score}%</span>
        </div>
        <div className="max-w-sm text-center sm:text-left">
          <p className="mb-1 text-sm font-semibold" style={{ color: 'var(--lv-accent)' }}>{horizon}</p>
          <p className="text-sm leading-relaxed text-muted">{description}</p>
        </div>
      </div>
    </section>
  )
}
