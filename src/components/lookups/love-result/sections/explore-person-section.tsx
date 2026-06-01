interface Person {
  name: string
  birth: string
}

export function ExplorePersonSection({ people }: { people: Person[] }) {
  return (
    <section className="mb-8 rounded-2xl border border-border bg-surface p-6 glow-border">
      <h2 className="mb-2 text-center text-lg font-bold text-foreground">Khám Phá Sâu Hơn Về Từng Người</h2>
      <p className="mb-5 text-center text-sm text-muted">
        Để hiểu rõ hơn về sự tương hợp, hãy khám phá bản đồ Thần số học hoàn chỉnh của mỗi cá nhân.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {people.map((person, i) => (
          <div key={person.name + i} className="rounded-xl border border-border/50 bg-surface-elevated p-5 text-center">
            <p className="mb-1 text-sm font-semibold text-foreground">{i === 0 ? '✨' : '🔮'} Báo cáo chi tiết của {person.name}</p>
            <ul className="mb-4 space-y-1 text-xs text-muted">
              <li>✦ Phân tích 17+ chỉ số, độc nhất</li>
              <li>🔮 Khám phá sứ mệnh & bài học cuộc đời</li>
              <li>📅 Dự báo vận hạn Năm - Tháng - Ngày</li>
            </ul>
            <a
              href={`/than-so-hoc/bao-cao?name=${encodeURIComponent(person.name)}&birthDate=${encodeURIComponent(person.birth)}`}
              className="inline-block rounded-xl border px-5 py-2 text-sm font-semibold transition-all hover:bg-surface-elevated"
              style={{ borderColor: 'var(--lv-accent)', color: 'var(--lv-accent)' }}
            >
              Xem Luận Giải Chi Tiết
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}
