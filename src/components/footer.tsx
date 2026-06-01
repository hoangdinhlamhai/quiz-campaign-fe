import { Link } from '@tanstack/react-router'
import { Sparkles } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-surface/50">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          {/* Logo + tagline */}
          <div className="flex flex-col items-center gap-2 md:items-start">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <span className="text-base font-bold text-foreground">
                Quiz<span className="text-primary">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-muted">
              Khám phá bản thân qua trắc nghiệm & thần số học
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-8 text-sm">
            <Link to="/$categorySlug" params={{ categorySlug: 'than-so-hoc' }} className="text-muted transition-colors hover:text-primary">
              Thần số học
            </Link>
            <Link to="/$categorySlug" params={{ categorySlug: 'mbti-quiz' }} className="text-muted transition-colors hover:text-primary">
              MBTI Quiz
            </Link>
            <Link to="/$categorySlug" params={{ categorySlug: 'trac-nghiem-nghe' }} className="text-muted transition-colors hover:text-primary">
              Trắc nghiệm nghề
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t border-border/30 pt-6 text-center">
          <p className="text-xs text-muted/70">
            © {new Date().getFullYear()} QuizHub. Nền tảng trắc nghiệm tâm lý & thần số học.
          </p>
        </div>
      </div>
    </footer>
  )
}
