import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { get } from '@/lib/api'
import type { QuizListItem } from '@/types'

interface RelatedQuizzesProps {
  currentSlug: string
}

export function RelatedQuizzes({ currentSlug }: RelatedQuizzesProps) {
  const [quizzes, setQuizzes] = useState<QuizListItem[]>([])

  useEffect(() => {
    get<QuizListItem[]>('/api/quizzes')
      .then((all) => setQuizzes(all.filter((q) => q.slug !== currentSlug).slice(0, 8)))
      .catch(() => {})
  }, [currentSlug])

  if (quizzes.length === 0) return null

  return (
    <section className="mt-10 border-t border-border pt-8">
      <h2 className="mb-5 text-center text-lg font-bold text-foreground">
        Có thể bạn cũng quan tâm
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {quizzes.map((q) => (
          <Link
            key={q.id}
            to="/lam-bai/$slug"
            params={{ slug: q.slug }}
            className="flex items-center justify-center rounded-xl border border-border bg-surface p-4 text-center text-sm font-medium text-foreground transition-all hover:border-accent/50 hover:bg-surface-elevated card-hover"
          >
            {q.title}
          </Link>
        ))}
      </div>
    </section>
  )
}
