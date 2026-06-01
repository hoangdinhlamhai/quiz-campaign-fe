import { motion } from 'framer-motion'
import type { IqResult, IqDetail } from '@/types'
import { ScoreReveal } from './score-reveal'

interface IqResultViewProps {
  data: IqResult
}

export function IqResultView({ data }: IqResultViewProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      <ScoreReveal value={data.iqScore} label="IQ Score" />
      <div className="rounded-xl border border-border bg-surface p-4 text-center">
        <p className="text-lg font-semibold text-accent">{data.classification}</p>
        <p className="mt-1 text-sm text-muted">
          Trả lời đúng {data.correct}/{data.total} câu
        </p>
        {data.age != null && (
          <p className="mt-2 text-xs text-muted">
            Tuổi: {data.age} · Điểm đã được chuẩn hóa theo độ tuổi của bạn
          </p>
        )}
      </div>
      {data.detail && <IqDetailSections detail={data.detail} />}
    </div>
  )
}

function IqDetailSections({ detail }: { detail: IqDetail }) {
  return (
    <motion.div
      className="flex w-full flex-col gap-4"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Section title={detail.band}>
        <p className="text-sm leading-relaxed text-muted">{detail.overview}</p>
      </Section>
      <Section title="Thế mạnh tư duy">
        <BulletList items={detail.cognitiveStrengths} />
      </Section>
      <Section title="Lĩnh vực nên rèn">
        <BulletList items={detail.growthAreas} />
      </Section>
      <Section title="Gợi ý phát triển">
        <BulletList items={detail.tips} />
      </Section>
      <div className="rounded-xl border border-border bg-surface p-4">
        <p className="text-center text-xs leading-relaxed text-muted">{detail.note}</p>
      </div>
    </motion.div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <h3 className="mb-2 text-sm font-bold text-accent">{title}</h3>
      {children}
    </div>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2 text-sm leading-relaxed text-muted">
          <span className="text-accent">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}
