import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { useState } from 'react'
import { get } from '@/lib/api'
import { motion } from 'framer-motion'
import { Hash, BarChart3, Calendar, Compass, Sparkles, TrendingUp, Briefcase, ChevronDown, ChevronUp } from 'lucide-react'
import type { NumerologyProfile, NumerologyCoreNumber, NumerologyLifeCycle, NumerologyPersonalYear, NumerologyDimension } from '@/types'

export const Route = createFileRoute('/than-so-hoc/bao-cao')({
  head: ({ loaderData }) => ({
    meta: [
      { title: `Báo Cáo Thần Số Học Của ${(loaderData as any)?.name || ''} — QuizHub` },
      { name: 'description', content: 'Phân tích thần số học chi tiết với 17+ chỉ số.' },
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    name: (search.name as string) || '',
    birthDate: (search.birthDate as string) || '',
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    if (!deps.name || !deps.birthDate) throw new Error('Missing name or birthDate');
    return get<NumerologyProfile>(`/api/numerology/profile?name=${encodeURIComponent(deps.name)}&birthDate=${encodeURIComponent(deps.birthDate)}`);
  },
  component: ProfilePage,
})

const TABS = [
  { key: 'numbers', label: 'Các chỉ số', icon: Hash },
  { key: 'cycles', label: 'Chu Kỳ', icon: Calendar },
  { key: 'forecast', label: 'Dự Báo', icon: TrendingUp },
  { key: 'career', label: 'Định Hướng', icon: Compass },
] as const

type TabKey = (typeof TABS)[number]['key']

function ProfilePage() {
  const data = useLoaderData({ from: '/than-so-hoc/bao-cao' })
  const [tab, setTab] = useState<TabKey>('numbers')

  return (
    <div className="mx-auto max-w-3xl animate-fade-in-up px-4 py-8">
      {/* Title */}
      <h1 className="mb-6 flex items-center gap-2 text-2xl font-bold text-foreground">
        <span className="text-xl">📊</span>
        Báo Cáo Thần Số Học Của{' '}
        <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{data.name}</span>
      </h1>

      {/* Hero Card */}
      <section className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600/30 via-purple-500/10 to-blue-600/10 p-6 text-center glow-border">
        <h2 className="text-xl font-bold text-foreground">{data.name}</h2>
        <p className="mb-4 text-sm text-muted">Ngày sinh: {formatDate(data.birthDate)}</p>
        <div className="mx-auto mb-2 flex h-20 w-20 items-center justify-center rounded-full border-2 border-purple-400/50 bg-purple-500/20 text-3xl font-bold text-purple-300">
          {data.coreNumbers[0]?.value}
        </div>
        <p className="text-xs font-semibold uppercase tracking-wider text-purple-300">SỐ CHỦ ĐẠO</p>

        {/* Mini number row */}
        <div className="mt-4 flex justify-center gap-3">
          {data.coreNumbers.slice(1).map((cn) => (
            <div key={cn.key} className="rounded-lg bg-surface/50 px-3 py-2 text-center">
              <p className="text-[10px] text-muted">{cn.label.replace('Số ', '')}</p>
              <p className="text-lg font-bold text-foreground">{cn.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tab Bar */}
      <div className="mb-6 flex overflow-x-auto rounded-xl border border-border bg-surface p-1">
        {TABS.map((t) => {
          const Icon = t.icon
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                tab === t.key
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      {tab === 'numbers' && <TabNumbers coreNumbers={data.coreNumbers} traits={data.traits} dimensions={data.dimensions} />}
      {tab === 'cycles' && <TabCycles cycles={data.lifeCycles} />}
      {tab === 'forecast' && <TabForecast years={data.personalYears} />}
      {tab === 'career' && <TabCareer top={data.topCareerGroups} caution={data.cautionCareerGroups} dimensions={data.dimensions} name={data.name} />}

      {/* Summary */}
      <section className="mt-8 rounded-2xl border border-border bg-gradient-to-br from-purple-500/10 to-pink-500/5 p-6 glow-border">
        <h2 className="mb-3 text-center text-lg font-bold text-foreground">Tổng Kết & Lời Khuyên</h2>
        <p className="text-center text-sm leading-relaxed text-muted">{data.summary}</p>
      </section>
    </div>
  )
}

// ── Tab 1: Core Numbers ──
function TabNumbers({ coreNumbers, traits, dimensions }: { coreNumbers: NumerologyCoreNumber[]; traits: NumerologyProfile['traits']; dimensions: NumerologyDimension[] }) {
  return (
    <div className="space-y-6">
      {/* Core numbers */}
      <div className="rounded-2xl border border-border bg-surface p-5">
        <h3 className="mb-4 text-base font-bold text-foreground">Các Chỉ Số Chính</h3>
        <div className="space-y-3">
          {coreNumbers.map((cn) => (
            <CoreNumberRow key={cn.key} cn={cn} />
          ))}
        </div>
      </div>

      {/* Traits */}
      <div className="rounded-2xl border border-border bg-surface p-5">
        <h3 className="mb-3 text-base font-bold text-foreground">Tính Cách Nổi Trội Của Bạn</h3>
        <div className="space-y-2">
          <p className="text-sm text-muted"><span className="font-semibold text-green-400">Điểm mạnh:</span> {traits.strengths.join('. ')}</p>
          <p className="text-sm text-muted"><span className="font-semibold text-red-400">Điểm yếu:</span> {traits.weaknesses.join('. ')}</p>
          <p className="text-sm text-muted"><span className="font-semibold text-yellow-400">Lời khuyên:</span> {traits.advice}</p>
        </div>
      </div>

      {/* 9 Dimensions */}
      <div className="rounded-2xl border border-border bg-surface p-5">
        <h3 className="mb-4 text-base font-bold text-foreground">Phân Tích 9 Nhóm Tính Cách Theo Bản Ngã</h3>
        <div className="space-y-3">
          {dimensions.map((dim, i) => (
            <div key={dim.label}>
              <p className="mb-1 text-xs font-medium text-foreground">{dim.label}</p>
              <div className="flex items-center gap-2">
                <div className="relative h-5 flex-1 overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(dim.percent + 15, 20)}%` }}
                    transition={{ duration: 0.5, delay: i * 0.04 }}
                  />
                </div>
                <span className="w-10 shrink-0 text-right text-xs font-bold text-purple-300">{dim.percent}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CoreNumberRow({ cn }: { cn: NumerologyCoreNumber }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-xl border border-border/50 bg-surface-elevated p-4">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center gap-3 text-left">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/20 text-lg font-bold text-purple-300">{cn.value}</span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-primary">{cn.label}</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {cn.keywords.map((k) => (
              <span key={k} className="rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] text-purple-300">{k}</span>
            ))}
          </div>
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-muted" /> : <ChevronDown className="h-4 w-4 text-muted" />}
      </button>
      {open && <p className="mt-3 text-sm leading-relaxed text-muted">{cn.description}</p>}
    </div>
  )
}

// ── Tab 2: Life Cycles ──
function TabCycles({ cycles }: { cycles: NumerologyLifeCycle[] }) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted">Cuộc đời mỗi người được chia thành ba chu kỳ chính, mỗi chu kỳ mang một con số chủ đạo riêng.</p>

      {/* Cycle overview */}
      <div className="flex justify-center gap-4">
        {cycles.map((c, i) => (
          <div key={c.label} className="flex flex-col items-center">
            <div className={`flex h-16 w-16 items-center justify-center rounded-full border-2 text-xl font-bold ${
              i === 0 ? 'border-green-400/50 bg-green-500/20 text-green-300' :
              i === 1 ? 'border-yellow-400/50 bg-yellow-500/20 text-yellow-300' :
              'border-purple-400/50 bg-purple-500/20 text-purple-300'
            }`}>
              {c.number}
            </div>
            <p className="mt-2 text-xs font-semibold text-foreground">{c.label}</p>
            <p className="text-[10px] font-bold uppercase text-muted">{c.name}</p>
            <p className="text-[10px] text-muted">{c.ageRange}</p>
          </div>
        ))}
      </div>

      {/* Cycle details */}
      {cycles.map((c) => (
        <div key={c.label} className="rounded-2xl border border-border bg-surface p-5">
          <h3 className="mb-2 text-base font-bold text-foreground">{c.label} ({c.name}) — {c.ageRange}, ứng với số {c.number}</h3>
          <p className="mb-3 text-sm text-muted">{c.description}</p>
          <div className="space-y-2 text-sm">
            <p className="text-green-400"><span className="font-semibold">Cơ hội:</span> {c.opportunities.join('. ')}</p>
            <p className="text-red-400"><span className="font-semibold">Thách thức:</span> {c.challenges.join('. ')}</p>
            <p className="text-yellow-400"><span className="font-semibold">Lời khuyên:</span> {c.advice}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Tab 3: Personal Year Forecast ──
function TabForecast({ years }: { years: NumerologyPersonalYear[] }) {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const py = years[selectedIdx]
  return (
    <div className="space-y-6">
      <h3 className="text-base font-bold text-foreground">Dự Báo Năm Cá Nhân</h3>

      {/* Year pills */}
      <div className="flex gap-2">
        {years.map((y, i) => (
          <button
            key={y.year}
            onClick={() => setSelectedIdx(i)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              i === selectedIdx ? 'bg-purple-500 text-white shadow-lg' : 'bg-surface text-muted hover:text-foreground'
            }`}
          >
            {y.year}
          </button>
        ))}
      </div>

      {/* Year detail */}
      <div className="rounded-2xl border border-border bg-surface p-5">
        <p className="mb-1 text-sm text-muted">Năm cá nhân {py.year} của bạn là: <span className="rounded-full bg-purple-500/20 px-2 py-0.5 font-bold text-purple-300">{py.number}</span></p>
        <h4 className="mb-3 text-lg font-bold text-primary">{py.title}</h4>
        <p className="mb-4 text-sm leading-relaxed text-muted">{py.description}</p>

        <div className="space-y-3 text-sm">
          <p><span className="font-semibold text-blue-400">Sự nghiệp & Tài chính:</span> {py.career}</p>
          <p><span className="font-semibold text-pink-400">Tình cảm & Mối quan hệ:</span> {py.love}</p>
          <p><span className="font-semibold text-red-400">Thách thức:</span> {py.challenge}</p>
        </div>

        <div className="mt-4 space-y-1">
          {py.advice.map((a, i) => (
            <p key={i} className="text-sm text-muted">• {a}</p>
          ))}
        </div>

        <p className="mt-4 rounded-xl border border-purple-500/20 bg-purple-500/5 p-3 text-center text-sm italic text-purple-300">
          Mantra: {py.mantra}
        </p>
      </div>
    </div>
  )
}

// ── Tab 4: Career Orientation ──
function TabCareer({ top, caution, dimensions, name }: { top: NumerologyProfile['topCareerGroups']; caution: NumerologyProfile['cautionCareerGroups']; dimensions: NumerologyDimension[]; name: string }) {
  return (
    <div className="space-y-6">
      <h3 className="text-base font-bold text-foreground">Định Hướng Nghề Nghiệp cho {name}</h3>

      {/* Career groups */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-green-500/20 bg-surface p-4">
          <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-green-400">
            <Briefcase className="h-4 w-4" /> Top nhóm ngành phù hợp
          </h4>
          {top.map((g) => (
            <div key={g.name} className="flex items-center justify-between py-1.5 text-sm">
              <span className="text-foreground">{g.name}</span>
              <span className="font-bold text-green-400">{g.percent}%</span>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-orange-500/20 bg-surface p-4">
          <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-orange-400">
            <Sparkles className="h-4 w-4" /> Nhóm ngành cần cân nhắc
          </h4>
          {caution.map((g) => (
            <div key={g.name} className="flex items-center justify-between py-1.5 text-sm">
              <span className="text-foreground">{g.name}</span>
              <span className="font-bold text-orange-400">{g.percent}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Dimension bars */}
      <div className="rounded-2xl border border-border bg-surface p-5">
        <h4 className="mb-4 text-sm font-bold text-foreground">Phân Tích 9 Nhóm Tính Cách</h4>
        <div className="space-y-3">
          {dimensions.map((dim, i) => (
            <div key={dim.label}>
              <p className="mb-1 text-xs font-medium text-foreground">{dim.label}</p>
              <div className="flex items-center gap-2">
                <div className="relative h-5 flex-1 overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(dim.percent + 15, 20)}%` }}
                    transition={{ duration: 0.5, delay: i * 0.04 }}
                  />
                </div>
                <span className="w-10 shrink-0 text-right text-xs font-bold text-blue-300">{dim.percent}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Helpers ──
function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}
