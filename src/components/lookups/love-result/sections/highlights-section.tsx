import { Sparkles } from 'lucide-react'
import type { LoveHighlight } from '@/types'

export function HighlightsSection({ items }: { items: LoveHighlight[] }) {
  if (items.length === 0) return null
  return (
    <section className="mb-8 rounded-2xl border border-border bg-surface p-6 glow-border">
      <div className="mb-4 flex items-center justify-center gap-2">
        <span className="text-lg">⭐</span>
        <h2 className="text-lg font-bold text-foreground">Điểm Tương Đồng Nổi Bật</h2>
      </div>
      <div className="flex flex-col gap-4">
        {items.map((h) => (
          <div key={h.title} className="rounded-xl border border-border/50 bg-surface-elevated p-4">
            <h3 className="mb-1 flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--lv-accent)' }}>
              <Sparkles className="h-3.5 w-3.5" />
              {h.title}
            </h3>
            <p className="text-sm leading-relaxed text-muted">{h.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
