import { Link, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { Menu, X, Sparkles, Brain, Briefcase } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Thần số học', slug: 'than-so-hoc', icon: Sparkles, color: 'text-purple-400' },
  { label: 'MBTI Quiz', slug: 'mbti-quiz', icon: Brain, color: 'text-pink-400' },
  { label: 'Trắc nghiệm nghề', slug: 'trac-nghiem-nghe', icon: Briefcase, color: 'text-blue-400' },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const currentPath = router.state.location.pathname

  return (
    <header className="glass fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 transition-colors group-hover:bg-primary/30">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <span className="text-lg font-bold text-foreground tracking-tight">
            Quiz<span className="text-primary">Hub</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = currentPath.includes(item.slug)
            return (
              <Link
                key={item.slug}
                to="/$categorySlug"
                params={{ categorySlug: item.slug }}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary/15 text-primary shadow-sm'
                    : 'text-muted hover:bg-surface-elevated hover:text-foreground'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-primary' : item.color}`} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-xl text-muted transition-colors hover:bg-surface-elevated hover:text-foreground md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-border/50 px-4 pb-4 md:hidden animate-fade-in-up">
          <nav className="flex flex-col gap-1 pt-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const isActive = currentPath.includes(item.slug)
              return (
                <Link
                  key={item.slug}
                  to="/$categorySlug"
                  params={{ categorySlug: item.slug }}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary/15 text-primary'
                      : 'text-muted hover:bg-surface-elevated hover:text-foreground'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-primary' : item.color}`} />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )
}
