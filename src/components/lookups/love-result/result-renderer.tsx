import type { LoveResult, LoveSection } from '@/types'
import { GaugeSection } from './sections/gauge-section'
import { DimensionsSection } from './sections/dimensions-section'
import { RadarSection } from './sections/radar-section'
import { PairTableSection } from './sections/pair-table-section'
import { PairInterpretationSection } from './sections/pair-interpretation-section'
import { LoveLanguagesSection } from './sections/love-languages-section'
import { AttractionMeterSection } from './sections/attraction-meter-section'
import { TimelineSection } from './sections/timeline-section'
import { LongevitySection } from './sections/longevity-section'
import { StrengthsWeaknessesSection } from './sections/strengths-weaknesses-section'
import { AdviceSection } from './sections/advice-section'
import { HighlightsSection } from './sections/highlights-section'
import { ExplorePersonSection } from './sections/explore-person-section'

function renderSection(s: LoveSection, key: number) {
  switch (s.type) {
    case 'gauge': return <GaugeSection key={key} percent={s.percent} headline={s.headline} summary={s.summary} />
    case 'dimensions': return <DimensionsSection key={key} rows={s.rows} />
    case 'radar': return <RadarSection key={key} axes={s.axes} />
    case 'pairTable': return <PairTableSection key={key} rows={s.rows} />
    case 'pairInterpretation': return <PairInterpretationSection key={key} items={s.items} />
    case 'loveLanguages': return <LoveLanguagesSection key={key} items={s.items} />
    case 'attractionMeter': return <AttractionMeterSection key={key} score={s.score} factors={s.factors} />
    case 'timeline': return <TimelineSection key={key} stages={s.stages} />
    case 'longevity': return <LongevitySection key={key} score={s.score} horizon={s.horizon} description={s.description} />
    case 'strengthsWeaknesses': return <StrengthsWeaknessesSection key={key} strengths={s.strengths} weaknesses={s.weaknesses} />
    case 'advice': return <AdviceSection key={key} title={s.title} points={s.points} />
    case 'highlights': return <HighlightsSection key={key} items={s.items} />
    case 'explorePerson': return <ExplorePersonSection key={key} people={s.people} />
    default: return null
  }
}

export function LoveResultRenderer({ data }: { data: LoveResult }) {
  const variant = data.variant ?? 'LOVE'
  const themeClass = variant === 'AFFINITY' ? 'theme-affinity' : 'theme-love'
  const sections = data.sections ?? []

  return (
    <div className={`mx-auto max-w-2xl animate-fade-in-up pb-12 ${themeClass}`}>
      <header className="mb-6 text-center">
        <p className="mb-1 text-sm text-muted">
          {variant === 'AFFINITY' ? '🔮 Phân Tích Tình Duyên' : '💕 Phân Tích Tình Yêu'}
        </p>
        <p className="mb-3 text-xs text-muted/70">
          {variant === 'AFFINITY'
            ? 'Tập trung vào sứ mệnh chung, sự trưởng thành & khả năng đồng hành dài lâu — khác Bói Tình Yêu (sức hút & cảm xúc).'
            : 'Tập trung vào chemistry, sức hút & ngôn ngữ yêu thương — khác Bói Tình Duyên (tương hợp dài hạn & duyên phận).'}
        </p>
        <h1 className="text-2xl font-bold md:text-3xl">
          <span className="lv-gradient-text">{data.person1Name}</span>
          <span className="mx-3 text-muted">&</span>
          <span className="lv-gradient-text">{data.person2Name}</span>
        </h1>
      </header>
      {sections.map((s, i) => renderSection(s, i))}
    </div>
  )
}
