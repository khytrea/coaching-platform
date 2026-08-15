export function EmptyState({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="text-center py-16 text-slate-400">
      <p className="text-lg mb-1">{title}</p>
      <p className="text-sm">{subtitle}</p>
    </div>
  )
}