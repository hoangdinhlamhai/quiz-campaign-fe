import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { useState } from 'react'
import { post } from '@/lib/api'
import { findLookupTool } from '@/lib/lookup-tools'
import { LoveForm } from '@/components/lookups/love-form'
import { BabyNamingForm } from '@/components/lookups/baby-naming-form'
import { AnimatedLoader } from '@/components/lookups/animated-loader'
import type { LoveLookupInput, BabyNamingInput, LookupSubmitResponse } from '@/types'

export const Route = createFileRoute('/tra-cuu/$toolSlug')({
  head: ({ params }) => {
    const tool = findLookupTool(params.toolSlug)
    return {
      meta: [
        { title: tool ? `${tool.name} — QuizHub` : 'Tra cứu — QuizHub' },
        { name: 'description', content: tool?.description || 'Tra cứu thần số học.' },
      ],
    }
  },
  loader: ({ params }) => {
    if (!findLookupTool(params.toolSlug)) {
      throw new Error('Tool not found')
    }
    return { toolSlug: params.toolSlug }
  },
  component: LookupFormPage,
})

function LookupFormPage() {
  const { toolSlug } = useParams({ from: '/tra-cuu/$toolSlug' })
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const tool = findLookupTool(toolSlug)!
  const isLove = tool.formType === 'LOVE' || tool.formType === 'AFFINITY'

  async function handleLoveSubmit(data: LoveLookupInput) {
    setLoading(true)
    setError(null)
    try {
      const res = await post<LookupSubmitResponse>('/api/lookups/love', data)
      await delay(2500)
      navigate({ to: '/tra-cuu-ket-qua/$id', params: { id: res.lookupId } })
    } catch {
      setError('Có lỗi xảy ra. Vui lòng thử lại.')
      setLoading(false)
    }
  }

  async function handleNamingSubmit(data: BabyNamingInput) {
    setLoading(true)
    setError(null)
    try {
      const res = await post<LookupSubmitResponse>('/api/lookups/baby-naming', data)
      await delay(2500)
      navigate({ to: '/tra-cuu-ket-qua/$id', params: { id: res.lookupId } })
    } catch {
      setError('Có lỗi xảy ra. Vui lòng thử lại.')
      setLoading(false)
    }
  }

  if (loading) return <AnimatedLoader />

  return (
    <main className="min-h-screen px-4 py-12">
      {error && <p className="mb-4 text-center text-danger">{error}</p>}
      {isLove ? (
        <LoveForm variant={tool.formType as 'LOVE' | 'AFFINITY'} onSubmit={handleLoveSubmit} />
      ) : (
        <BabyNamingForm onSubmit={handleNamingSubmit} />
      )}
    </main>
  )
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
