import { motion } from 'framer-motion'
import type { LikertResult, LikertDetail } from '@/types'
import { ScoreReveal } from './score-reveal'

interface LikertResultViewProps {
  data: LikertResult
}

function getLevelColor(level: string): string {
  const l = level.toLowerCase()
  if (l.includes('cao') || l.includes('xuất sắc') || l.includes('tốt')) return 'text-accent'
  if (l.includes('trung bình') || l.includes('khá')) return 'text-yellow-400'
  return 'text-red-400'
}

export function LikertResultView({ data }: LikertResultViewProps) {
  const dims = Object.entries(data.dimensions)
  const isSingle = dims.length === 1 && dims[0][0] === 'TOTAL'

  if (isSingle) {
    const [, d] = dims[0]
    return (
      <div className="flex flex-col items-center gap-4">
        <ScoreReveal value={d.percent} suffix="%" label={d.level} />
        <GaugeBar percent={d.percent} level={d.level} />
        {data.detail && <LikertDetailSections detail={data.detail} />}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {dims.map(([key, d]) => (
        <div key={key} className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">{key}</span>
            <span className={getLevelColor(d.level)}>{d.level} ({d.percent}%)</span>
          </div>
          <GaugeBar percent={d.percent} level={d.level} />
        </div>
      ))}
    </div>
  )
}

function LikertDetailSections({ detail }: { detail: LikertDetail }) {
  return (
    <motion.div
      className="mt-2 flex w-full flex-col gap-4"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Section title={`${detail.name} — ${detail.level}`}>
        <p className="text-sm leading-relaxed text-muted">{detail.overview}</p>
      </Section>
      <Section title="Điểm mạnh">
        <BulletList items={detail.strengths} />
      </Section>
      <Section title="Cần lưu ý">
        <BulletList items={detail.watchouts} />
      </Section>
      <Section title="Gợi ý phát triển">
        <BulletList items={detail.tips} />
      </Section>
      <div className="rounded-xl border border-border bg-surface p-4">
        <p className="text-center text-sm italic leading-relaxed text-muted">
          {detail.closing}
        </p>
      </div>
    </motion.div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <h3 className="mb-2 text-sm font-bold text-accent">{title}</h3>
      {children}
    </div>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2 text-sm leading-relaxed text-muted">
          <span className="text-accent">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function GaugeBar({ percent, level }: { percent: number; level: string }) {
  return (
    <div className="h-3 w-full overflow-hidden rounded-full bg-surface">
      <div
        className={`h-full rounded-full transition-all duration-1000 ${getBarColor(level)}`}
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}

function getBarColor(level: string): string {
  const l = level.toLowerCase()
  if (l.includes('cao') || l.includes('xuất sắc') || l.includes('tốt')) return 'bg-accent'
  if (l.includes('trung bình') || l.includes('khá')) return 'bg-yellow-500'
  return 'bg-red-500'
}
