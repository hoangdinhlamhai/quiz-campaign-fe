import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import type { DiscResult, DiscDetail } from '@/types'

interface DiscResultViewProps {
  data: DiscResult
}

const DISC_COLORS: Record<string, string> = {
  D: 'bg-red-500',
  I: 'bg-yellow-500',
  S: 'bg-green-500',
  C: 'bg-blue-500',
}

const DISC_LABELS: Record<string, string> = {
  D: 'Dominance',
  I: 'Influence',
  S: 'Steadiness',
  C: 'Conscientiousness',
}

export function DiscResultView({ data }: DiscResultViewProps) {
  const total = Object.values(data.counts).reduce((a, b) => a + b, 0)

  return (
    <div className="flex flex-col gap-6">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="text-3xl font-bold text-accent">Nhóm: {data.dominant}</span>
      </motion.div>

      <div className="flex flex-col gap-4">
        {(['D', 'I', 'S', 'C'] as const).map((dim) => {
          const pct = total > 0 ? (data.counts[dim] / total) * 100 : 25
          return (
            <div key={dim} className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">{dim} — {DISC_LABELS[dim]}</span>
                <span className="text-muted">{Math.round(pct)}%</span>
              </div>
              <div className="h-4 overflow-hidden rounded-full bg-surface">
                <motion.div
                  className={`h-full rounded-full ${DISC_COLORS[dim]}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.1 }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {data.detail && <DiscGroupCard detail={data.detail} />}
    </div>
  )
}

function DiscGroupCard({ detail }: { detail: DiscDetail }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-2xl border border-border bg-surface p-6 glow-border"
    >
      <h2 className="text-center text-xl font-bold text-accent">
        Bạn thuộc nhóm {detail.group} ({detail.name}) - {detail.title}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-muted">{detail.description}</p>

      <h3 className="mt-6 mb-3 text-base font-semibold text-foreground">Đặc điểm nổi bật:</h3>
      <ul className="flex flex-col gap-2.5">
        {detail.traits.map((t) => (
          <li key={t.label} className="flex gap-2 text-sm leading-relaxed">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
            <span className="text-muted">
              <span className="font-semibold text-foreground">{t.label}:</span> {t.desc}
            </span>
          </li>
        ))}
      </ul>

      <h3 className="mt-6 mb-3 text-base font-semibold text-foreground">Điểm cần cải thiện:</h3>
      <ul className="flex flex-col gap-2.5">
        {detail.improvements.map((imp) => (
          <li key={imp} className="flex gap-2 text-sm leading-relaxed">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
            <span className="text-muted">{imp}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}
