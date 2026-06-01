import type { LoveComparisonRow } from '@/types'

export function PairTableSection({ rows }: { rows: LoveComparisonRow[] }) {
  return (
    <section className="mb-8 rounded-2xl border border-border bg-surface p-6 glow-border">
      <div className="mb-4 flex items-center justify-center gap-2">
        <span className="text-lg">📊</span>
        <h2 className="text-lg font-bold text-foreground">So Sánh Chỉ Số Thần Số Học</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50 text-muted">
              <th className="py-3 text-left font-medium">Chỉ Số</th>
              <th className="py-3 text-center font-medium">Người 1</th>
              <th className="py-3 text-center font-medium">Người 2</th>
              <th className="py-3 text-center font-medium">Hòa Hợp</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const emoji = row.match === 'high' ? '💜💜💜' : row.match === 'medium' ? '💜💜' : '💜'
              return (
                <tr key={row.label} className="border-b border-border/30 transition-colors hover:bg-surface-elevated/50">
                  <td className="py-3 font-medium" style={{ color: 'var(--lv-accent)' }}>{row.label}</td>
                  <td className="py-3 text-center text-lg font-bold text-foreground">{row.person1}</td>
                  <td className="py-3 text-center text-lg font-bold text-foreground">{row.person2}</td>
                  <td className="py-3 text-center">{emoji}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
