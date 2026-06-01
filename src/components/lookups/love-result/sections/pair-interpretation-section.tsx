import type { LovePairInterpretation } from '@/types'

const VERDICT_META: Record<string, { label: string; emoji: string }> = {
  high: { label: 'Rất hợp', emoji: '💜' },
  medium: { label: 'Khá hợp', emoji: '✨' },
  low: { label: 'Bổ sung', emoji: '🌗' },
}

export function PairInterpretationSection({ items }: { items: LovePairInterpretation[] }) {
  return (
    <section className="mb-8 rounded-2xl border border-border bg-surface p-6 glow-border">
      <h2 className="mb-5 text-center text-lg font-bold text-foreground">Luận Giải Theo Cặp Con Số</h2>
      <div className="flex flex-col gap-4">
        {items.map((it) => {
          const meta = VERDICT_META[it.verdict] ?? VERDICT_META.medium
          return (
            <div key={it.numberLabel} className="rounded-xl border border-border/50 bg-surface-elevated p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold" style={{ color: 'var(--lv-accent)' }}>{it.numberLabel}</h3>
                <span className="text-xs text-muted">
                  {it.p1} × {it.p2} · {meta.emoji} {meta.label}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-muted">{it.text}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
