import type { LoShuGrid } from '@/types'

interface LoShuGridProps {
  grid: LoShuGrid
}

// Traditional Lo Shu magic square layout: 4-9-2 / 3-5-7 / 8-1-6
const LO_SHU_ORDER = [
  [4, 9, 2],
  [3, 5, 7],
  [8, 1, 6],
]

export function LoShuGridView({ grid }: LoShuGridProps) {
  return (
    <div className="grid grid-cols-3 gap-1 w-fit">
      {LO_SHU_ORDER.flat().map((digit) => {
        const count = grid.counts[digit] ?? 0
        const isMissing = grid.missing.includes(digit)
        // Lặp số theo tần suất, nhưng cap ở 3 để không tràn ô; nhiều hơn → "d×n"
        const label = isMissing ? '' : count <= 3 ? String(digit).repeat(count) : `${digit}×${count}`
        return (
          <div
            key={digit}
            className={`flex h-12 w-12 items-center justify-center rounded-lg border font-bold transition-colors ${
              label.length > 3 ? 'text-xs' : 'text-sm'
            } ${
              isMissing
                ? 'border-border/50 bg-white/5 text-muted/40'
                : 'border-purple-500/30 bg-purple-500/10 text-purple-300'
            }`}
          >
            {label}
          </div>
        )
      })}
    </div>
  )
}
