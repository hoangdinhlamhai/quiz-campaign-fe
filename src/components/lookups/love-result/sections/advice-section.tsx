export function AdviceSection({ title, points }: { title: string; points: string[] }) {
  return (
    <section className="mb-8 rounded-2xl border border-border p-6 glow-border" style={{ background: 'var(--lv-soft)' }}>
      <div className="mb-4 flex items-center justify-center gap-2">
        <span className="text-lg">💡</span>
        <h2 className="text-lg font-bold text-foreground">{title}</h2>
      </div>
      <ul className="mx-auto flex max-w-lg flex-col gap-3">
        {points.map((p, i) => (
          <li key={i} className="flex items-start gap-3 rounded-xl border border-border/50 bg-surface-elevated p-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white lv-gradient-bg">
              {i + 1}
            </span>
            <span className="text-sm leading-relaxed text-muted">{p}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
