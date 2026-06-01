import { motion } from 'framer-motion'
import type { LoveDimension } from '@/types'

export function DimensionsSection({ rows }: { rows: LoveDimension[] }) {
  return (
    <section className="mb-8 rounded-2xl border border-border bg-surface p-6 glow-border">
      <h2 className="mb-5 text-center text-lg font-bold text-foreground">Phân Tích 9 Khía Cạnh Tình Cảm</h2>
      <div className="mb-5 flex justify-center gap-8 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-6 rounded-full" style={{ background: 'var(--lv-from)' }} />
          Người thứ nhất
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-6 rounded-full" style={{ background: 'var(--lv-to)' }} />
          Người thứ hai
        </span>
      </div>
      <div className="flex flex-col gap-4">
        {rows.map((dim, i) => (
          <div key={dim.label}>
            <div className="mb-1 text-xs font-medium text-foreground">{dim.label}</div>
            <div className="flex items-center gap-3">
              <div className="flex flex-1 justify-end">
                <motion.div
                  className="flex h-5 items-center justify-start rounded-full px-2 text-[10px] font-bold text-white"
                  style={{ background: 'var(--lv-from)' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${dim.person1Percent}%` }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                >
                  {dim.person1Percent}%
                </motion.div>
              </div>
              <div className="flex flex-1">
                <motion.div
                  className="flex h-5 items-center justify-end rounded-full px-2 text-[10px] font-bold text-white"
                  style={{ background: 'var(--lv-to)' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${dim.person2Percent}%` }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                >
                  {dim.person2Percent}%
                </motion.div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
