import type { NameAnalysis, NamingBirthOverview } from '@/types'
import { ScoreReveal } from '@/components/results/score-reveal'
import { LoShuGridView } from './lo-shu-grid'
import { NumberRow } from './number-row'

interface NameCardProps {
  analysis: NameAnalysis
  birthOverview: NamingBirthOverview
}

const TUONG_COLORS: Record<string, string> = {
  sinh: 'text-green-400',
  khac: 'text-red-400',
  hoa: 'text-muted',
  trung: 'text-muted',
}

export function NameCard({ analysis, birthOverview }: NameCardProps) {
  const colorClass = TUONG_COLORS[analysis.tuongSinhKhac] ?? 'text-muted'
  const detailHref = `/than-so-hoc/bao-cao?name=${encodeURIComponent(analysis.fullName)}&birthDate=${encodeURIComponent(birthOverview.birthDate)}`

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 glow-border">
      {/* Header: score + name */}
      <div className="mb-4 flex items-center gap-4">
        <div className="shrink-0">
          <ScoreReveal value={analysis.score} label="Điểm" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-foreground">{analysis.fullName}</h3>
          <p className="text-sm text-muted">Tên: {analysis.name}</p>
        </div>
      </div>

      {/* Ngu Hanh + Tuong */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-300">
          Ngũ hành tên: {analysis.nguHanhTen}
        </span>
        <span className={`text-xs font-medium ${colorClass}`}>
          {analysis.tuongText}
        </span>
      </div>

      {/* Combined Lo Shu */}
      <div className="mb-4">
        <p className="mb-2 text-xs font-medium text-muted">Biểu đồ tổng hợp (tên + ngày sinh)</p>
        <LoShuGridView grid={analysis.combinedLoShu} />
      </div>

      {/* Number rows */}
      {analysis.numbers.length > 0 && (
        <div className="mb-4 flex flex-col gap-2">
          <p className="text-xs font-medium text-muted">Các chỉ số</p>
          {analysis.numbers.map((row) => (
            <NumberRow key={row.key} row={row} />
          ))}
        </div>
      )}

      {/* Detail link */}
      <a href={detailHref}
        className="mt-2 block w-full rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 py-3 text-center text-sm font-semibold text-purple-300 transition-all hover:from-purple-500/30 hover:to-blue-500/30"
      >
        Xem Luận Giải Chi Tiết Cho Tên Này
      </a>
    </div>
  )
}
