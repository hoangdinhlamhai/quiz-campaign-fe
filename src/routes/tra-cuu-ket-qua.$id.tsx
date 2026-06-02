import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { useState } from 'react'
import { get, post } from '@/lib/api'
import { SenlyzerLock } from '@/components/senlyzer-lock'
import { LoveResultRenderer } from '@/components/lookups/love-result/result-renderer'
import { NamingResultRenderer } from '@/components/lookups/naming-result/result-renderer'
import type { LookupResponse, UnlockedLookup } from '@/types'

export const Route = createFileRoute('/tra-cuu-ket-qua/$id')({
  head: () => ({
    meta: [
      { title: 'Kết quả tra cứu — QuizHub' },
      { name: 'description', content: 'Xem kết quả tra cứu thần số học.' },
    ],
  }),
  loader: async ({ params }) => {
    const data = await get<LookupResponse>(`/api/lookups/${params.id}`)
    return data
  },
  component: LookupResultPage,
})

function LookupResultPage() {
  const initialData = useLoaderData({ from: '/tra-cuu-ket-qua/$id' })
  const [data, setData] = useState<LookupResponse>(initialData)
  const [unlocking, setUnlocking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleUnlocked() {
    if (!data.isLocked) return
    setUnlocking(true)
    setError(null)
    try {
      const result = await post<UnlockedLookup>(`/api/lookups/${data.lookupId}/unlock`)
      setData(result)
    } catch {
      setError('Lỗi kết nối khi mở khoá kết quả.')
    } finally {
      setUnlocking(false)
    }
  }

  if (data.isLocked) {
    return (
      <main className="min-h-screen px-4 py-8">
        <SenlyzerLock contentId={`lookup-${data.lookupId}`} onUnlocked={handleUnlocked}>
          {unlocking ? (
            <p className="p-8 text-center text-muted">Đang mở khoá kết quả...</p>
          ) : error ? (
            <p className="p-8 text-center text-danger">{error}</p>
          ) : (
            <div className="mx-auto h-48 w-full max-w-md rounded-lg bg-surface" />
          )}
        </SenlyzerLock>
      </main>
    )
  }

  return (
    <main className="min-h-screen px-4 py-8">
      {data.result.kind === 'LOVE' ? (
        <LoveResultRenderer data={data.result} />
      ) : (
        <NamingResultRenderer data={data.result} />
      )}
    </main>
  )
}
