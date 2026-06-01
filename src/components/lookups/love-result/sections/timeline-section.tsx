import type { LoveTimelineStage } from '@/types'

const TONE_META: Record<string, { dot: string; emoji: string }> = {
  good: { dot: 'var(--lv-accent)', emoji: '🌸' },
  neutral: { dot: 'hsl(200 80% 55%)', emoji: '🌿' },
  watch: { dot: 'hsl(38 92% 50%)', emoji: '⚠️' },
}

export function TimelineSection({ stages }: { stages: LoveTimelineStage[] }) {
  return (
    <section className="mb-8 rounded-2xl border border-border bg-surface p-6 glow-border">
      <div className="mb-5 flex items-center justify-center gap-2">
        <span className="text-lg">🕰️</span>
        <h2 className="text-lg font-bold text-foreground">Hành Trình Duyên Phận</h2>
      </div>
      <div className="relative ml-3 flex flex-col gap-6 border-l border-border pl-6">
        {stages.map((s) => {
          const meta = TONE_META[s.tone] ?? TONE_META.neutral
          return (
            <div key={s.phase} className="relative">
              <span
                className="absolute -left-[31px] top-1 flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-background"
                style={{ background: meta.dot }}
              />
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-foreground">{meta.emoji} {s.phase}</h3>
                {s.ageRange && <span className="text-xs text-muted">· {s.ageRange}</span>}
              </div>
              <p className="mt-1 text-sm leading-relaxed text-muted">{s.description}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
