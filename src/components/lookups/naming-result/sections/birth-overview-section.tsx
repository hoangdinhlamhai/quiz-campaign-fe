import type { NamingBirthOverview } from '@/types'
import { LoShuGridView } from './lo-shu-grid'

interface BirthOverviewSectionProps {
  overview: NamingBirthOverview
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

export function BirthOverviewSection({ overview }: BirthOverviewSectionProps) {
  const groupLabel = overview.trachGroup === 'DONG' ? 'Đông tứ mệnh' : 'Tây tứ mệnh'

  return (
    <section className="rounded-2xl border border-border bg-surface p-6 glow-border">
      <h2 className="mb-4 text-lg font-bold text-foreground">
        Phân Tích Tổng Quan Ngày Sinh {formatDate(overview.birthDate)}
      </h2>

      <div className="flex flex-col gap-6 md:flex-row">
        {/* Lo Shu Grid */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs font-medium text-muted">Biểu đồ ngày sinh</p>
          <LoShuGridView grid={overview.loShu} />
        </div>

        {/* Info panel */}
        <div className="flex flex-1 flex-col gap-3">
          <InfoRow label="Can Chi" value={overview.canChi} />
          <InfoRow label="Mệnh" value={overview.menh} />
          <InfoRow label="Ngũ hành" value={overview.nguHanh} />
          <InfoRow label="Trạch mệnh" value={`${overview.trachMenh} (${groupLabel})`} />
          <InfoRow
            label="Các số còn thiếu"
            value={overview.loShu.missing.length > 0 ? overview.loShu.missing.join(', ') : 'Không'}
          />
          {overview.goal && (
            <div className="mt-2 rounded-lg bg-purple-500/10 px-3 py-2">
              <p className="text-xs text-purple-300">{overview.goal}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-xs font-medium text-muted whitespace-nowrap">{label}:</span>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  )
}
