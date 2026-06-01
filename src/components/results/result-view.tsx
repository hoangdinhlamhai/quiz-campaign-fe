import type { ScoreResult } from '@/types'
import { MbtiResultView } from './mbti-result'
import { DiscResultView } from './disc-result'
import { RadarResultView } from './radar-result'
import { LikertResultView } from './likert-result'
import { IqResultView } from './iq-result'

interface ResultViewProps {
  result: ScoreResult
}

export function ResultView({ result }: ResultViewProps) {
  switch (result.kind) {
    case 'MBTI':
      return <MbtiResultView data={result} />
    case 'DISC':
      return <DiscResultView data={result} />
    case 'BIG_FIVE':
    case 'MI':
      return <RadarResultView data={result} />
    case 'LIKERT':
      return <LikertResultView data={result} />
    case 'IQ':
      return <IqResultView data={result} />
  }
}
