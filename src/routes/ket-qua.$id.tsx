import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { get } from '@/lib/api'
import { ResultGate } from '@/components/results/result-gate'
import type { ResultResponse } from '@/types'

export const Route = createFileRoute('/ket-qua/$id')({
  head: () => ({
    meta: [
      { title: 'Kết quả trắc nghiệm — Quiz Platform' },
      { name: 'description', content: 'Xem kết quả trắc nghiệm tâm lý của bạn.' },
    ],
  }),
  loader: async ({ params }) => {
    const data = await get<ResultResponse>(`/api/results/${params.id}`)
    return data
  },
  component: ResultPage,
})

function ResultPage() {
  const data = useLoaderData({ from: '/ket-qua/$id' })
  return (
    <main className="min-h-screen px-4 py-8">
      <ResultGate resultId={data.resultId} initialData={data} />
    </main>
  )
}
