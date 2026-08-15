// components/dashboard/UpcomingSessionsList.tsx
type SessionItem = {
  id: string
  title: string
  start_time: string
  color: string
  subtitle?: string
}

export function UpcomingSessionsList({ sessions, emptyText }: { sessions: SessionItem[]; emptyText: string }) {
  if (sessions.length === 0) {
    return <p className="text-sm text-slate-300 py-6 text-center">{emptyText}</p>
  }

  return (
    <ul className="space-y-3">
      {sessions.map((s) => {
        const date = new Date(s.start_time)
        return (
          <li key={s.id} className="flex items-center gap-3">
            <span className="w-1.5 h-10 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">{s.title}</p>
              {s.subtitle && <p className="text-xs text-slate-400 truncate">{s.subtitle}</p>}
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-slate-500">
                {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </p>
              <p className="text-xs text-slate-400">
                {date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
              </p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}