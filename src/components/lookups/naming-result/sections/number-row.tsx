import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { NamingNumberRow } from '@/types'

interface NumberRowProps {
  row: NamingNumberRow
}

export function NumberRow({ row }: NumberRowProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className={`rounded-lg border ${row.isKarmic ? 'border-amber-500/40 bg-amber-500/5' : 'border-border bg-surface'}`}>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">{row.label}</span>
          {row.isKarmic && (
            <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400">
              Số Nợ Nghiệp
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-bold ${row.isKarmic ? 'text-amber-400' : 'text-accent'}`}>
            {row.value}
          </span>
          <ChevronDown className={`h-4 w-4 text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {open && (
        <div className="border-t border-border px-4 py-3">
          <div className="flex flex-wrap gap-1.5">
            {row.keywords.map((kw) => (
              <span key={kw} className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-muted">
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
