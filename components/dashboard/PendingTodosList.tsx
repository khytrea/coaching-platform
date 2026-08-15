// components/dashboard/PendingTodosList.tsx
type PendingItem = {
  id: string
  title: string
  subtitle?: string
  count: number
}

export function PendingTodosList({ items, emptyText }: { items: PendingItem[]; emptyText: string }) {
  if (items.length === 0) {
    return <p className="text-sm text-slate-300 py-6 text-center">{emptyText}</p>
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.id} className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-700 truncate">{item.title}</p>
            {item.subtitle && <p className="text-xs text-slate-400 truncate">{item.subtitle}</p>}
          </div>
          <span className="text-xs bg-amber-50 text-amber-500 rounded-full px-2 py-0.5 shrink-0">
            {item.count} left
          </span>
        </li>
      ))}
    </ul>
  )
}