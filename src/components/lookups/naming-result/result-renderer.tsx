import type { NamingResult } from '@/types'
import { BirthOverviewSection } from './sections/birth-overview-section'
import { NameCard } from './sections/name-card'
import { SuggestedNames } from './sections/suggested-names'

interface NamingResultRendererProps {
  data: NamingResult
}

export function NamingResultRenderer({ data }: NamingResultRendererProps) {
  const { birthOverview, names, mode } = data

  return (
    <div className="mx-auto max-w-2xl animate-fade-in-up pb-12">
      <header className="mb-6 text-center">
        <p className="mb-1 text-sm text-muted">
          {mode === 'SUGGEST' && '✨ Gợi Ý Tên Cho Bé'}
          {mode === 'COMPARE' && '⚖️ So Sánh Nhiều Tên'}
          {mode === 'CHECK' && '🔍 Kiểm Tra Tên'}
        </p>
      </header>

      <div className="flex flex-col gap-6">
        <BirthOverviewSection overview={birthOverview} />

        {mode === 'SUGGEST' && (
          <SuggestedNames names={names.map((n) => n.fullName)} />
        )}

        {names.map((analysis) => (
          <NameCard key={analysis.fullName} analysis={analysis} birthOverview={birthOverview} />
        ))}
      </div>
    </div>
  )
}
