import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts'

interface RadarAxis {
  axis: string
  p1: number
  p2: number
}

export function RadarSection({ axes }: { axes: RadarAxis[] }) {
  return (
    <section className="mb-8 rounded-2xl border border-border bg-surface p-6 glow-border">
      <h2 className="mb-2 text-center text-lg font-bold text-foreground">Bản Đồ Tương Hợp</h2>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={axes} cx="50%" cy="50%" outerRadius="72%">
            <PolarGrid stroke="hsl(260 15% 22%)" />
            <PolarAngleAxis dataKey="axis" tick={{ fill: 'hsl(260 10% 80%)', fontSize: 11 }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: 'hsl(260 10% 45%)', fontSize: 9 }} />
            <Radar name="Người 1" dataKey="p1" stroke="hsl(330 78% 60%)" fill="hsl(330 78% 60%)" fillOpacity={0.3} strokeWidth={2} />
            <Radar name="Người 2" dataKey="p2" stroke="hsl(268 65% 58%)" fill="hsl(268 65% 58%)" fillOpacity={0.3} strokeWidth={2} />
            <Legend wrapperStyle={{ fontSize: 12, color: 'hsl(260 10% 55%)' }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
