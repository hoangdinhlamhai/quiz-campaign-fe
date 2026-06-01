import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { get, post } from '@/lib/api'
// import { SenlyzerLock } from '@/components/senlyzer-lock' // CPA GATE - tạm comment
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
      <main className="flex min-h-screen flex-col items-center justify-center px-4 py-8">
        {unlocking && <p className="text-muted">Đang mở khoá...</p>}
        {error && <p className="text-danger">{error}</p>}
        {/* CPA GATE tạm comment — uncomment khi deploy production
        <SenlyzerLock contentId={`lookup-${data.lookupId}`} onUnlocked={handleUnlocked}>
          <div className="h-48 w-full max-w-md rounded-lg bg-surface" />
        </SenlyzerLock>
        */}
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
