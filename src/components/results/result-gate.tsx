import { useState } from 'react'
import { post } from '@/lib/api'
import { SenlyzerLock } from '@/components/senlyzer-lock'
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

  async function handleUnlocked() {
    if (!data.isLocked) return
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
      <SenlyzerLock contentId={`quiz-${resultId}`} onUnlocked={handleUnlocked}>
        {unlocking ? (
          <p className="p-8 text-center text-muted">Đang mở khoá kết quả...</p>
        ) : error ? (
          <p className="p-8 text-center text-danger">{error}</p>
        ) : (
          <div className="h-48 rounded-lg bg-surface" />
        )}
      </SenlyzerLock>
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
