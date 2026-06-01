import type { LikertResult } from '@/types'
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
        {data.detail && (
          <div className="mt-2 w-full rounded-xl border border-border bg-surface p-5 glow-border">
            <p className="text-center text-base font-bold text-accent">
              {data.detail.name} — {data.detail.level}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted">{data.detail.description}</p>
          </div>
        )}
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
