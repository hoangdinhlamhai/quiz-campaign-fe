interface LoveLanguageItem {
  label: string
  person: 1 | 2
  description: string
}

export function LoveLanguagesSection({ items }: { items: LoveLanguageItem[] }) {
  return (
    <section className="mb-8 rounded-2xl border border-border bg-surface p-6 glow-border">
      <div className="mb-5 flex items-center justify-center gap-2">
        <span className="text-lg">💌</span>
        <h2 className="text-lg font-bold text-foreground">Ngôn Ngữ Tình Yêu</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((it) => (
          <div key={it.person} className="rounded-xl border border-border/50 bg-surface-elevated p-5 text-center">
            <p className="mb-1 text-xs text-muted">{it.person === 1 ? '💜 Người thứ nhất' : '💗 Người thứ hai'}</p>
            <p className="mb-2 text-base font-bold lv-gradient-text">{it.label}</p>
            <p className="text-sm leading-relaxed text-muted">{it.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
