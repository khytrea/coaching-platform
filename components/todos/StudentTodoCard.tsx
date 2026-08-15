'use client'

import type { TodoList } from '@/hooks/useTodoLists'

type Props = {
  list: TodoList
  onToggle: (itemId: string, currentState: boolean) => void
}

function isOverdue(dueDate: string | null) {
  if (!dueDate) return false
  return new Date(dueDate) < new Date(new Date().toDateString())
}

export function StudentTodoCard({ list, onToggle }: Props) {
  const completed = list.items.filter((i) => i.is_completed).length
  const total = list.items.length
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100)
  const allDone = total > 0 && completed === total
  const overdue = !allDone && isOverdue(list.due_date)

  return (
    <div className={`rounded-2xl border p-5 bg-white transition ${allDone ? 'border-emerald-100' : 'border-slate-100'}`}>
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-medium text-slate-700">{list.title}</h3>
        {list.due_date && (
          <span className={`text-xs px-2 py-1 rounded-full shrink-0 ml-2 ${
            overdue ? 'bg-rose-50 text-rose-400' : 'bg-slate-50 text-slate-400'
          }`}>
            {overdue ? 'Overdue' : `Due ${new Date(list.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${allDone ? 'bg-emerald-300' : 'bg-violet-300'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-xs text-slate-400 shrink-0">{completed}/{total}</span>
      </div>

      <ul className="space-y-2.5">
        {list.items.map((item) => (
          <li key={item.id}>
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={item.is_completed}
                onChange={() => onToggle(item.id, item.is_completed)}
                className="mt-0.5 w-4 h-4 rounded-full border-slate-300 text-violet-400 focus:ring-violet-200 cursor-pointer"
              />
              <span
                className={`text-sm transition ${
                  item.is_completed ? 'text-slate-400 line-through' : 'text-slate-600 group-hover:text-slate-800'
                }`}
              >
                {item.content}
              </span>
            </label>
          </li>
        ))}
      </ul>

      {allDone && (
        <p className="text-xs text-emerald-500 mt-4 font-medium">🎉 All done!</p>
      )}
    </div>
  )
}