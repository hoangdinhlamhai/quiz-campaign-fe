import { motion } from 'framer-motion'
import type { MbtiResult } from '@/types'

interface MbtiResultViewProps {
  data: MbtiResult
}

const DIMENSIONS: [string, string][] = [['E', 'I'], ['S', 'N'], ['T', 'F'], ['J', 'P']]

function DimensionBar({ left, right, leftVal, rightVal }: { left: string; right: string; leftVal: number; rightVal: number }) {
  const total = leftVal + rightVal
  const leftPct = total > 0 ? (leftVal / total) * 100 : 50

  return (
    <div className="flex items-center gap-3">
      <span className="w-6 text-right font-bold text-accent">{left}</span>
      <div className="relative h-6 flex-1 overflow-hidden rounded-full bg-surface">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-accent"
          initial={{ width: '50%' }}
          animate={{ width: `${leftPct}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-foreground">
          {Math.round(leftPct)}% / {Math.round(100 - leftPct)}%
        </span>
      </div>
      <span className="w-6 font-bold text-muted">{right}</span>
    </div>
  )
}

export function MbtiResultView({ data }: MbtiResultViewProps) {
  return (
    <div className="flex flex-col gap-6">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="text-4xl font-bold text-accent">{data.type}</span>
        {data.detail && <p className="mt-1 text-lg text-muted">{data.detail.name}</p>}
      </motion.div>

      <div className="flex flex-col gap-3">
        {DIMENSIONS.map(([l, r]) => (
          <DimensionBar
            key={l + r}
            left={l}
            right={r}
            leftVal={data.poles[l as keyof typeof data.poles]}
            rightVal={data.poles[r as keyof typeof data.poles]}
          />
        ))}
      </div>

      {data.detail && (
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4">
          <p className="text-sm text-foreground">{data.detail.description}</p>
          <DetailList title="Điểm mạnh" items={data.detail.strengths} />
          <DetailList title="Điểm yếu" items={data.detail.weaknesses} />
          <DetailList title="Nghề nghiệp phù hợp" items={data.detail.careers} />
        </div>
      )}
    </div>
  )
}

function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="mb-1 text-sm font-semibold text-accent">{title}</h3>
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item} className="rounded-md bg-accent-muted px-2 py-1 text-xs text-foreground">
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
