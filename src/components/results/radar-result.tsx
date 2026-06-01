import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'
import type { BigFiveResult, MiResult } from '@/types'

interface RadarResultViewProps {
  data: BigFiveResult | MiResult
}

const BIG_FIVE_LABELS: Record<string, string> = {
  O: 'Cởi mở',
  C: 'Tận tâm',
  E: 'Hướng ngoại',
  A: 'Dễ chịu',
  N: 'Nhạy cảm',
}

// nhãn ngắn cho trục radar MI (key → tiếng Việt). Quiz Big Five chạy quizType
// MI_LIKERT nên cũng tới đây với key O/C/E/A/N → map kèm.
const MI_AXIS_LABELS: Record<string, string> = {
  NGON_NGU: 'Ngôn ngữ',
  LOGIC: 'Logic',
  KHONG_GIAN: 'Không gian',
  AM_NHAC: 'Âm nhạc',
  VAN_DONG: 'Vận động',
  THIEN_NHIEN: 'Thiên nhiên',
  TUONG_TAC: 'Tương tác',
  NOI_TAM: 'Nội tâm',
  O: 'Cởi mở',
  C: 'Tận tâm',
  E: 'Hướng ngoại',
  A: 'Dễ chịu',
  N: 'Nhạy cảm',
}

export function RadarResultView({ data }: RadarResultViewProps) {
  const chartData = data.kind === 'BIG_FIVE'
    ? Object.entries(data.dimensions).map(([key, val]) => ({
        axis: BIG_FIVE_LABELS[key] || key,
        value: val,
      }))
    : Object.entries(data.intelligences).map(([key, val]) => ({
        axis: MI_AXIS_LABELS[key] || key,
        value: val,
      }))

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-xl font-bold text-accent">
        {data.kind === 'BIG_FIVE' ? 'Big Five Personality' : 'Đa trí thông minh (MI)'}
      </h2>
      <div className="h-80 w-full max-w-md">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="75%">
            <PolarGrid stroke="hsl(222 20% 20%)" />
            <PolarAngleAxis
              dataKey="axis"
              tick={{ fill: 'hsl(210 20% 92%)', fontSize: 12 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: 'hsl(215 15% 55%)', fontSize: 10 }}
            />
            <Radar
              dataKey="value"
              stroke="hsl(141 74% 42%)"
              fill="hsl(141 74% 42%)"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {data.kind === 'BIG_FIVE' && data.detail && (
        <div className="flex w-full flex-col gap-3">
          {data.detail.map((d) => (
            <div key={d.key} className="rounded-xl border border-border bg-surface p-4">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">{d.label}</span>
                <span className="text-xs text-accent">{d.level} ({d.percent}%)</span>
              </div>
              <p className="text-sm leading-relaxed text-muted">{d.description}</p>
            </div>
          ))}
        </div>
      )}

      {data.kind === 'MI' && data.detail && (
        <div className="flex w-full flex-col gap-3">
          <p className="text-center text-sm text-muted">
            Nổi bật: <span className="font-semibold text-accent">{data.detail.topLabels.join(', ')}</span>
          </p>
          {data.detail.items.map((it) => (
            <div key={it.label} className="rounded-xl border border-border bg-surface p-4">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">{it.label}</span>
                <span className="text-xs text-accent">{it.percent}%</span>
              </div>
              <p className="text-sm leading-relaxed text-muted">{it.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
