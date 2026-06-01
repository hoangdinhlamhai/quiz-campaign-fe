import { useState, useEffect } from 'react'
import { post } from '@/lib/api'
// import { SenlyzerLock } from '@/components/senlyzer-lock' // CPA GATE - tạm comment
import { ResultView } from './result-view'
import { RelatedQuizzes } from './related-quizzes'
import type { ResultResponse, UnlockedResult } from '@/types'

interface ResultGateProps {
  resultId: string
  initialData: ResultResponse
}

export function ResultGate({ resultId, initialData }: ResultGateProps) {
  const [data, setData] = useState<ResultResponse>(initialData)
  const [unlocking, setUnlocking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // AUTO-UNLOCK: tạm thời bỏ CPA gate để test
  useEffect(() => {
    if (data.isLocked) {
      autoUnlock()
    }
  }, [])

  async function autoUnlock() {
    setUnlocking(true)
    setError(null)
    try {
      const result = await post<UnlockedResult>(`/api/results/${resultId}/unlock`)
      setData(result)
    } catch {
      setError('Lỗi kết nối khi mở khoá kết quả.')
    } finally {
      setUnlocking(false)
    }
  }

  if (data.isLocked) {
    return (
      <div className="mx-auto max-w-2xl p-4 text-center">
        <h1 className="mb-4 text-2xl font-bold text-foreground">{data.quizTitle}</h1>
        {unlocking && (
          <p className="text-muted">Đang mở khoá kết quả...</p>
        )}
        {error && (
          <p className="text-danger">{error}</p>
        )}
        {/* CPA GATE tạm comment — uncomment khi deploy production
        <SenlyzerLock contentId={`quiz-${resultId}`} onUnlocked={handleUnlocked}>
          <div className="h-48 rounded-lg bg-surface" />
        </SenlyzerLock>
        */}
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl p-4">
      <h1 className="mb-6 text-center text-2xl font-bold text-foreground">{data.quizTitle}</h1>
      <ResultView result={data.result} />
      <RelatedQuizzes currentSlug={data.quizSlug} />
    </div>
  )
}
