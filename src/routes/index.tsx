import { createFileRoute, Link } from '@tanstack/react-router'
import { get } from '@/lib/api'
import { getLookupToolsByCategory } from '@/lib/lookup-tools'
import { Sparkles, Brain, Briefcase, ArrowRight, Zap, Users, Star } from 'lucide-react'
import type { CategorySummary } from '@/types'

export const Route = createFileRoute('/')(  {
  loader: async () => {
    try {
      return { categories: await get<CategorySummary[]>('/api/categories?includeQuizzes=true') }
    } catch {
      return { categories: [] }
    }
  },
  component: HomePage,
})

const CATEGORY_META: Record<string, { icon: typeof Sparkles; gradient: string; accent: string }> = {
  'than-so-hoc': {
    icon: Sparkles,
    gradient: 'from-purple-500/20 to-pink-500/20',
    accent: 'text-purple-400',
  },
  'mbti-quiz': {
    icon: Brain,
    gradient: 'from-pink-500/20 to-rose-500/20',
    accent: 'text-pink-400',
  },
  'trac-nghiem-nghe': {
    icon: Briefcase,
    gradient: 'from-blue-500/20 to-cyan-500/20',
    accent: 'text-blue-400',
  },
}

function HomePage() {
  const { categories } = Route.useLoaderData()

  return (
    <main className="animate-fade-in-up">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="particles" />
        {/* Glow orbs */}
        <div className="absolute top-20 left-1/4 h-72 w-72 rounded-full bg-purple-600/10 blur-[100px]" />
        <div className="absolute bottom-10 right-1/4 h-56 w-56 rounded-full bg-pink-600/10 blur-[80px]" />

        <div className="relative mx-auto max-w-5xl px-4 py-24 text-center md:py-32">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Zap className="h-3.5 w-3.5" />
            Miễn phí · Không cần đăng ký
          </div>

          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Khám phá bản thân qua{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Trắc nghiệm & Thần số học
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted md:text-xl">
            Hơn 15 bài trắc nghiệm khoa học về tính cách, trí tuệ, nghề nghiệp
            và công cụ tra cứu thần số học.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="#categories"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/30"
            >
              Khám phá ngay
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          {/* Stats */}
          <div className="mt-16 flex justify-center gap-8 md:gap-16">
            {[
              { icon: Star, value: '15+', label: 'Bài trắc nghiệm' },
              { icon: Users, value: '3', label: 'Danh mục chính' },
              { icon: Sparkles, value: '3', label: 'Công cụ số học' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1">
                <stat.icon className="h-5 w-5 text-primary/60" />
                <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                <span className="text-xs text-muted">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category Cards ── */}
      <section id="categories" className="mx-auto max-w-6xl px-4 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">Chọn danh mục</h2>
          <p className="mt-3 text-muted">Nhấn vào danh mục để xem các bài trắc nghiệm</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {categories.map((cat) => {
            const meta = CATEGORY_META[cat.slug] ?? CATEGORY_META['mbti-quiz']
            const Icon = meta.icon
            const lookupCount = getLookupToolsByCategory(cat.slug).length
            const totalCount = cat.quizCount + lookupCount

            return (
              <Link
                key={cat.id}
                to="/$categorySlug"
                params={{ categorySlug: cat.slug }}
                className={`card-hover group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${meta.gradient} p-6 glow-border`}
              >
                {/* Icon */}
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-elevated/80">
                  <Icon className={`h-7 w-7 ${meta.accent}`} />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p className="mt-2 text-sm text-muted line-clamp-2">{cat.description}</p>
                  )}
                </div>

                <div className="mt-auto flex items-center justify-between">
                  <span className="rounded-lg bg-surface-elevated px-3 py-1 text-xs font-medium text-muted">
                    {totalCount} bài
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted transition-all group-hover:translate-x-1 group-hover:text-primary" />
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ── Popular Quizzes ── */}
      {categories.some((c) => c.quizzes && c.quizzes.length > 0) && (
        <section className="border-t border-border/50 bg-surface/30">
          <div className="mx-auto max-w-6xl px-4 py-20">
            <div className="mb-12 text-center">
              <h2 className="text-2xl font-bold text-foreground md:text-3xl">Bài test phổ biến</h2>
              <p className="mt-3 text-muted">Được nhiều người làm nhất</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categories
                .flatMap((c) => (c.quizzes ?? []).map((q) => ({ ...q, catSlug: c.slug })))
                .slice(0, 8)
                .map((quiz) => (
                  <Link
                    key={quiz.id}
                    to="/lam-bai/$slug"
                    params={{ slug: quiz.slug }}
                    className="card-hover group flex flex-col gap-3 rounded-xl border border-border bg-surface p-4"
                  >
                    <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {quiz.title}
                    </h4>
                    <div className="mt-auto flex items-center gap-2 text-xs text-muted">
                      <span className="rounded-md bg-primary/10 px-2 py-0.5 font-medium text-primary">
                        {quiz.quizType}
                      </span>
                      <span>{quiz.totalQuestions} câu</span>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
