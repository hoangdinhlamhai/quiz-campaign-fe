import { useState } from 'react'
import { Baby } from 'lucide-react'
import type { BabyNamingInput, NamingMode, Gender } from '@/types'

interface BabyNamingFormProps {
  onSubmit: (data: BabyNamingInput) => void
  submitting?: boolean
}

const MODE_OPTIONS: { value: NamingMode; label: string }[] = [
  { value: 'SUGGEST', label: 'Tìm & Gợi ý' },
  { value: 'COMPARE', label: 'So sánh nhiều tên' },
  { value: 'CHECK', label: 'Kiểm tra một tên' },
]

const YEARS = Array.from({ length: 81 }, (_, i) => 1950 + i)
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1)
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1)

export function BabyNamingForm({ onSubmit, submitting }: BabyNamingFormProps) {
  const [mode, setMode] = useState<NamingMode>('SUGGEST')
  const [day, setDay] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [familyName, setFamilyName] = useState('')
  const [gender, setGender] = useState<Gender>('MALE')
  const [namesText, setNamesText] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!day || !month || !year) errs.date = 'Vui lòng chọn đầy đủ ngày sinh'
    if (!familyName.trim()) errs.familyName = 'Vui lòng nhập họ của bé'
    if (mode !== 'SUGGEST' && !namesText.trim()) {
      errs.names = mode === 'CHECK' ? 'Vui lòng nhập tên cần kiểm tra' : 'Vui lòng nhập ít nhất một tên'
    }
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    const birthDate = `${year}-${String(Number(month)).padStart(2, '0')}-${String(Number(day)).padStart(2, '0')}`
    const payload: BabyNamingInput = { mode, birthDate, gender, familyName: familyName.trim() }
    if (mode === 'CHECK') {
      payload.names = [namesText.trim()]
    } else if (mode === 'COMPARE') {
      payload.names = namesText.split('\n').map((n) => n.trim()).filter(Boolean)
    }
    onSubmit(payload)
  }

  return (
    <div className="mx-auto max-w-lg animate-fade-in-up">
      <div className="relative mb-8 text-center">
        <div className="absolute inset-0 -top-10 mx-auto h-40 w-60 rounded-full bg-purple-600/10 blur-[80px]" />
        <div className="relative">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 glow-border">
            <Baby className="h-8 w-8 text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Đặt Tên Con
          </h1>
          <p className="mt-2 text-muted">Phân tích phong thủy thần số học cho tên của bé</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6 rounded-2xl border border-border bg-surface p-6 glow-border">
          {/* 1. Chọn Chức Năng */}
          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-accent">1. Chọn Chức Năng</legend>
            <div className="grid grid-cols-3 gap-2">
              {MODE_OPTIONS.map((opt) => (
                <button key={opt.value} type="button" onClick={() => setMode(opt.value)}
                  className={`rounded-lg px-3 py-2 text-xs font-medium transition-all ${mode === opt.value ? 'bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/50' : 'bg-white/5 text-muted hover:bg-white/10'}`}
                >{opt.label}</button>
              ))}
            </div>
          </fieldset>

          {/* 2. Thông Tin Cơ Bản */}
          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-accent">2. Nhập Thông Tin Cơ Bản</legend>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <select value={day} onChange={(e) => setDay(e.target.value)} className="input-mystic text-sm">
                <option value="">Ngày</option>
                {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <select value={month} onChange={(e) => setMonth(e.target.value)} className="input-mystic text-sm">
                <option value="">Tháng</option>
                {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
              <select value={year} onChange={(e) => setYear(e.target.value)} className="input-mystic text-sm">
                <option value="">Năm</option>
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            {errors.date && <p className="mb-2 text-xs text-danger">{errors.date}</p>}
            <input type="text" value={familyName} onChange={(e) => setFamilyName(e.target.value)}
              placeholder="Họ của bé" className="input-mystic mb-3" />
            {errors.familyName && <p className="mb-2 text-xs text-danger">{errors.familyName}</p>}
            <div className="flex gap-2">
              {(['MALE', 'FEMALE'] as Gender[]).map((g) => (
                <button key={g} type="button" onClick={() => setGender(g)}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${gender === g ? 'bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/50' : 'bg-white/5 text-muted hover:bg-white/10'}`}
                >{g === 'MALE' ? 'Nam' : 'Nữ'}</button>
              ))}
            </div>
          </fieldset>

          {/* 3. Nhập Tên */}
          {mode !== 'SUGGEST' && (
            <fieldset>
              <legend className="mb-2 text-sm font-semibold text-accent">3. Nhập Tên Cần Phân Tích</legend>
              <textarea value={namesText} onChange={(e) => setNamesText(e.target.value)}
                rows={mode === 'COMPARE' ? 4 : 2}
                placeholder={mode === 'CHECK' ? 'Nhập một tên (VD: Minh Anh)' : 'Mỗi dòng một tên (VD:\nMinh Anh\nThanh Tùng)'}
                className="input-mystic resize-none" />
              {errors.names && <p className="mt-1.5 text-xs text-danger">{errors.names}</p>}
            </fieldset>
          )}
        </div>

        <button type="submit" disabled={submitting}
          className="mt-8 w-full rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 py-4 text-base font-bold text-white shadow-lg shadow-purple-500/25 transition-all hover:shadow-xl hover:shadow-purple-500/30 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
        >{submitting ? 'Đang phân tích...' : 'Phân Tích Ngay'}</button>
      </form>
    </div>
  )
}
