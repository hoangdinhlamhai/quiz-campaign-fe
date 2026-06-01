import { createFileRoute, Link } from '@tanstack/react-router'
import { get } from '@/lib/api'
import { getLookupToolsByCategory } from '@/lib/lookup-tools'
import { ArrowLeft, ArrowRight, Clock, HelpCircle, Sparkles, Brain, Briefcase } from 'lucide-react'
import type { CategorySummary } from '@/types'

const CATEGORY_THEME: Record<string, { icon: typeof Sparkles; gradient: string; accent: string; bgGlow: string }> = {
  'than-so-hoc': {
    icon: Sparkles,
    gradient: 'from-purple-600/30 via-purple-500/10 to-transparent',
    accent: 'text-purple-400',
    bgGlow: 'bg-purple-600/8',
  },
  'mbti-quiz': {
    icon: Brain,
    gradient: 'from-pink-600/30 via-pink-500/10 to-transparent',
    accent: 'text-pink-400',
    bgGlow: 'bg-pink-600/8',
  },
  'trac-nghiem-nghe': {
    icon: Briefcase,
    gradient: 'from-blue-600/30 via-blue-500/10 to-transparent',
    accent: 'text-blue-400',
    bgGlow: 'bg-blue-600/8',
  },
}

export const Route = createFileRoute('/$categorySlug/')({
  head: ({ params }) => ({
    meta: [
      { title: `${params.categorySlug === 'than-so-hoc' ? 'Thần số học' : params.categorySlug === 'mbti-quiz' ? 'MBTI Quiz' : 'Trắc nghiệm nghề'} — QuizHub` },
    ],
  }),
  loader: async ({ params }) => {
    try {
      const categories = await get<CategorySummary[]>(
        `/api/categories?includeQuizzes=true`
      )
      const category = categories.find((c) => c.slug === params.categorySlug) ?? null
      return { category }
    } catch {
      return { category: null }
    }
  },
  component: CategoryPage,
})

function CategoryPage() {
  const { category } = Route.useLoaderData()
  const { categorySlug } = Route.useParams()

  if (!category) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-20 text-center animate-fade-in-up">
        <p className="text-muted text-lg">Không tìm thấy danh mục "{categorySlug}".</p>
        <Link to="/" className="mt-4 inline-flex items-center gap-2 text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> Quay về trang chủ
        </Link>
      </main>
    )
  }

  const theme = CATEGORY_THEME[categorySlug] ?? CATEGORY_THEME['mbti-quiz']
  const Icon = theme.icon
  const quizzes = category.quizzes ?? []
  const lookupTools = getLookupToolsByCategory(categorySlug)

  return (
    <main className="animate-fade-in-up">
      {/* ── Category Banner ── */}
      <section className={`relative overflow-hidden bg-gradient-to-b ${theme.gradient}`}>
        <div className="absolute inset-0 bg-hero-gradient opacity-30" />
        <div className="particles" />

        <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-20">
          <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> Trang chủ
          </Link>

          <div className="flex items-center gap-4">
            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${theme.bgGlow}`}>
              <Icon className={`h-8 w-8 ${theme.accent}`} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground md:text-4xl">{category.name}</h1>
              {category.description && (
                <p className="mt-2 text-muted md:text-lg">{category.description}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Content Grid ── */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        {lookupTools.length === 0 && quizzes.length === 0 ? (
          <p className="text-center text-muted py-12">Chưa có bài trắc nghiệm nào trong danh mục này.</p>
        ) : (
          <>
            {/* Lookup tools (Thần số học) */}
            {lookupTools.length > 0 && (
              <div className="mb-10">
                <h2 className="mb-5 text-lg font-semibold text-foreground">Tra cứu thần số học</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {lookupTools.map((tool) => (
                    <Link
                      key={tool.slug}
                      to="/tra-cuu/$toolSlug"
                      params={{ toolSlug: tool.slug }}
                      className="card-hover group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-border bg-surface p-5 glow-border"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10">
                        <Sparkles className="h-6 w-6 text-purple-400" />
                      </div>
                      <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                        {tool.name}
                      </h3>
                      <p className="text-sm text-muted line-clamp-2">{tool.description}</p>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <span className="rounded-lg bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-400">
                          Tra cứu
                        </span>
                        <ArrowRight className="h-4 w-4 text-muted group-hover:translate-x-1 group-hover:text-primary transition-all" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Quiz cards */}
            {quizzes.length > 0 && (
              <div>
                {lookupTools.length > 0 && (
                  <h2 className="mb-5 text-lg font-semibold text-foreground">Bài trắc nghiệm</h2>
                )}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {quizzes.map((quiz) => (
                    <Link
                      key={quiz.id}
                      to="/lam-bai/$slug"
                      params={{ slug: quiz.slug }}
                      className="card-hover group flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5 glow-border"
                    >
                      <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                        {quiz.title}
                      </h3>
                      {quiz.description && (
                        <p className="text-sm text-muted line-clamp-2">{quiz.description}</p>
                      )}
                      <div className="mt-auto flex flex-wrap items-center gap-2 pt-2 text-xs text-muted">
                        <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 font-medium text-primary">
                          {quiz.quizType}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <HelpCircle className="h-3 w-3" /> {quiz.totalQuestions} câu
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {quiz.timeLimitMins} phút
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  )
}
