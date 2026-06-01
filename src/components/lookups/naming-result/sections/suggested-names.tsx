interface SuggestedNamesProps {
  names: string[]
}

export function SuggestedNames({ names }: SuggestedNamesProps) {
  if (names.length === 0) return null

  return (
    <div className="mb-6">
      <p className="mb-2 text-sm font-semibold text-accent">Tên gợi ý hàng đầu</p>
      <div className="flex flex-wrap gap-2">
        {names.map((name) => (
          <span
            key={name}
            className="rounded-full bg-purple-500/15 px-3 py-1.5 text-sm font-medium text-purple-300"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  )
}
