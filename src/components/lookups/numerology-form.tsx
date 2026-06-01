import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { get } from '@/lib/api'
import type { NumerologyLookupMeta, NumberMeaning } from '@/types'

interface NumerologyFormProps {
  onSubmit: (data: { name: string; birthDate: string }) => void
  submitting?: boolean
}

const CHIP_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33]

function validateName(name: string): string | null {
  if (!name.trim()) return 'Vui lòng nhập họ và tên'
  if (name.trim().length < 2) return 'Tên phải có ít nhất 2 ký tự'
  return null
}

function validateBirthDate(date: string): string | null {
  if (!date) return 'Vui lòng chọn ngày sinh'
  if (new Date(date) > new Date()) return 'Ngày sinh không thể ở tương lai'
  return null
}

export function NumerologyForm({ onSubmit, submitting }: NumerologyFormProps) {
  const [name, setName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [selected, setSelected] = useState<number | null>(null)
  const [meta, setMeta] = useState<NumerologyLookupMeta | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    let active = true
    get<NumerologyLookupMeta>('/api/numerology/lookups/meta')
      .then((m) => active && setMeta(m))
      .catch(() => active && setMeta({ count: 0, numbers: [] }))
    return () => {
      active = false
    }
  }, [])

  const selectedInfo: NumberMeaning | undefined = meta?.numbers.find((n) => n.number === selected)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs: Record<string, string> = {}
    const n = validateName(name)
    const d = validateBirthDate(birthDate)
    if (n) errs.name = n
    if (d) errs.birthDate = d
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    onSubmit({ name: name.trim(), birthDate })
  }

  return (
    <div className="mx-auto max-w-lg animate-fade-in-up">
      {/* Mystic header */}
      <div className="relative mb-8 text-center">
        <div className="absolute inset-0 -top-10 mx-auto h-40 w-60 rounded-full bg-purple-600/10 blur-[80px]" />
        <div className="relative">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 glow-border">
            <Sparkles className="h-8 w-8 text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Tra Cứu Thần Số Học Cá Nhân
          </h1>
          <p className="mt-2 text-muted">Khám phá con số chủ đạo và bức tranh thần số học của bạn</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6 rounded-2xl border border-border bg-surface p-6 glow-border">
          {/* Quick-pick chips */}
          <fieldset>
            <legend className="mb-3 text-center text-xs font-medium text-muted">
              Bạn đã biết Con Số Chủ Đạo của mình? Chọn nhanh bên dưới:
            </legend>
            <div className="flex flex-wrap justify-center gap-2">
              {CHIP_NUMBERS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setSelected(selected === n ? null : n)}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-bold transition-all ${
                    selected === n
                      ? 'border-purple-400 bg-purple-500/30 text-purple-200'
                      : 'border-border bg-white/5 text-muted hover:border-purple-500/50 hover:text-foreground'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>

            {/* Inline meaning panel */}
            {selected !== null && selectedInfo && (
              <div className="mt-4 rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20 text-base font-bold text-purple-300">
                    {selectedInfo.number}
                  </span>
                  <span className="text-sm font-semibold text-primary">{selectedInfo.strength}</span>
                </div>
                <div className="mb-2 flex flex-wrap gap-1">
                  {selectedInfo.keywords.map((k) => (
                    <span key={k} className="rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] text-purple-300">
                      {k}
                    </span>
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-muted">{selectedInfo.desc}</p>
              </div>
            )}
          </fieldset>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted">
              Hoặc nhập thông tin đầy đủ
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Real lookup count */}
          {meta && (
            <div className="flex justify-center">
              <span className="rounded-full bg-white/5 px-4 py-1.5 text-xs text-muted">
                <span className="font-bold text-foreground">{meta.count.toLocaleString('vi-VN')}</span> lượt tra cứu
              </span>
            </div>
          )}

          {/* Name + birthdate */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-muted">Họ và tên đầy đủ</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-mystic"
              placeholder="Nguyễn Văn A"
            />
            {errors.name && <p className="mt-1.5 text-xs text-danger">{errors.name}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-muted">Ngày tháng năm sinh</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="input-mystic"
            />
            {errors.birthDate && <p className="mt-1.5 text-xs text-danger">{errors.birthDate}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-8 w-full rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 py-4 text-base font-bold text-white shadow-lg shadow-purple-500/25 transition-all hover:shadow-xl hover:shadow-purple-500/30 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Đang phân tích...' : '✨ Xem Phân Tích Chi Tiết'}
        </button>
      </form>
    </div>
  )
}
