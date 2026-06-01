import { motion } from 'framer-motion'

interface Factor {
  label: string
  value: number
}

export function AttractionMeterSection({ score, factors }: { score: number; factors: Factor[] }) {
  return (
    <section className="mb-8 rounded-2xl border border-border bg-surface p-6 glow-border">
      <div className="mb-4 flex items-center justify-center gap-2">
        <span className="text-lg">🔥</span>
        <h2 className="text-lg font-bold text-foreground">Sức Hút Giữa Hai Người</h2>
      </div>
      <div className="mb-6 text-center">
        <span className="text-4xl font-extrabold lv-gradient-text">{score}%</span>
      </div>
      <div className="flex flex-col gap-4">
        {factors.map((f, i) => (
          <div key={f.label}>
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-muted">{f.label}</span>
              <span className="font-semibold text-foreground">{f.value}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-elevated">
              <motion.div
                className="h-full rounded-full lv-gradient-bg"
                initial={{ width: 0 }}
                animate={{ width: `${f.value}%` }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
