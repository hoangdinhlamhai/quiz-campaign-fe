import type { IqResult } from '@/types'
import { ScoreReveal } from './score-reveal'

interface IqResultViewProps {
  data: IqResult
}

export function IqResultView({ data }: IqResultViewProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      <ScoreReveal value={data.iqScore} label="IQ Score" />
      <div className="rounded-xl border border-border bg-surface p-4 text-center">
        <p className="text-lg font-semibold text-accent">{data.classification}</p>
        <p className="mt-1 text-sm text-muted">
          Trả lời đúng {data.correct}/{data.total} câu
        </p>
        {data.age != null && (
          <p className="mt-2 text-xs text-muted">
            Tuổi: {data.age} · Điểm đã được chuẩn hóa theo độ tuổi của bạn
          </p>
        )}
      </div>
    </div>
  )
}
