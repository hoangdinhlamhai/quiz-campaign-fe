import { useState } from 'react'
import { Heart, Sparkles } from 'lucide-react'
import type { LoveLookupInput, LovePersonInput } from '@/types'

interface LoveFormProps {
  variant: 'LOVE' | 'AFFINITY'
  onSubmit: (data: LoveLookupInput) => void
  submitting?: boolean
}

function validateName(name: string): string | null {
  if (!name.trim()) return 'Vui lòng nhập tên'
  if (name.trim().length < 2) return 'Tên phải có ít nhất 2 ký tự'
  return null
}

function validateBirthDate(date: string): string | null {
  if (!date) return 'Vui lòng chọn ngày sinh'
  if (new Date(date) > new Date()) return 'Ngày sinh không thể ở tương lai'
  return null
}

export function LoveForm({ variant, onSubmit, submitting }: LoveFormProps) {
  const [person1, setPerson1] = useState<LovePersonInput>({ name: '', birthDate: '' })
  const [person2, setPerson2] = useState<LovePersonInput>({ name: '', birthDate: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs: Record<string, string> = {}
    const n1 = validateName(person1.name)
    const n2 = validateName(person2.name)
    const d1 = validateBirthDate(person1.birthDate)
    const d2 = validateBirthDate(person2.birthDate)
    if (n1) errs.name1 = n1
    if (n2) errs.name2 = n2
    if (d1) errs.date1 = d1
    if (d2) errs.date2 = d2
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    onSubmit({ person1, person2, variant })
  }

  const title = variant === 'LOVE' ? 'Bói Tình Yêu' : 'Bói Tình Duyên'
  const subtitle = variant === 'LOVE'
    ? 'Xem độ hợp tình yêu giữa hai người theo thần số học'
    : 'Phân tích duyên phận và mức độ gắn kết lâu dài'
  const themeClass = variant === 'AFFINITY' ? 'theme-affinity' : 'theme-love'
  const Icon = variant === 'AFFINITY' ? Sparkles : Heart

  return (
    <div className={`mx-auto max-w-3xl animate-fade-in-up ${themeClass}`}>
      {/* Mystic header */}
      <div className="relative mb-8 text-center">
        <div className="absolute inset-0 -top-10 mx-auto h-40 w-80 rounded-full blur-[80px]" style={{ background: 'var(--lv-soft)' }} />
        <div className="relative">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl glow-border" style={{ background: 'var(--lv-soft)' }}>
            <Icon className="h-8 w-8" style={{ color: 'var(--lv-accent)' }} />
          </div>
          <h1 className="text-3xl font-bold lv-gradient-text">
            {title}
          </h1>
          <p className="mt-2 text-muted">{subtitle}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <PersonCard
            label="Người thứ nhất"
            emoji="💜"
            person={person1}
            onChange={setPerson1}
            nameError={errors.name1}
            dateError={errors.date1}
          />

          {/* Heart connector (desktop only) */}
          <div className="hidden md:flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

          <PersonCard
            label="Người thứ hai"
            emoji="💗"
            person={person2}
            onChange={setPerson2}
            nameError={errors.name2}
            dateError={errors.date2}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-8 w-full rounded-xl py-4 text-base font-bold text-white shadow-lg transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed lv-gradient-bg"
        >
          {submitting ? 'Đang phân tích...' : '✨ Xem kết quả'}
        </button>
      </form>
    </div>
  )
}

function PersonCard({ label, emoji, person, onChange, nameError, dateError }: {
  label: string
  emoji: string
  person: LovePersonInput
  onChange: (p: LovePersonInput) => void
  nameError?: string
  dateError?: string
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6 glow-border">
      <div className="flex items-center gap-2">
        <span className="text-xl">{emoji}</span>
        <h2 className="text-base font-semibold text-foreground">{label}</h2>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-muted">Họ và tên</label>
        <input
          type="text"
          value={person.name}
          onChange={(e) => onChange({ ...person, name: e.target.value })}
          className="input-mystic"
          placeholder="Nguyễn Văn A"
        />
        {nameError && <p className="mt-1.5 text-xs text-danger">{nameError}</p>}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-muted">Ngày sinh</label>
        <input
          type="date"
          value={person.birthDate}
          onChange={(e) => onChange({ ...person, birthDate: e.target.value })}
          className="input-mystic"
        />
        {dateError && <p className="mt-1.5 text-xs text-danger">{dateError}</p>}
      </div>
    </div>
  )
}
