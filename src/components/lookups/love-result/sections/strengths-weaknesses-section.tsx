export function StrengthsWeaknessesSection({ strengths, weaknesses }: { strengths: string[]; weaknesses: string[] }) {
  return (
    <section className="mb-8 grid gap-4 sm:grid-cols-2">
      <div className="rounded-2xl border border-border bg-surface p-6 glow-border">
        <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-foreground">
          <span className="text-lg">💪</span> Điểm Mạnh
        </h3>
        <ul className="flex flex-col gap-2">
          {strengths.map((s, i) => (
            <li key={i} className="flex gap-2 text-sm leading-relaxed text-muted">
              <span style={{ color: 'var(--lv-accent)' }}>✦</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl border border-border bg-surface p-6 glow-border">
        <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-foreground">
          <span className="text-lg">🌱</span> Cần Lưu Ý
        </h3>
        <ul className="flex flex-col gap-2">
          {weaknesses.map((w, i) => (
            <li key={i} className="flex gap-2 text-sm leading-relaxed text-muted">
              <span className="text-warning">!</span>
              <span>{w}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
