'use client'

import { useState } from 'react'
import type { TodoList } from '@/hooks/useTodoLists'

type Props = {
  list: TodoList
  onAddItem: (content: string) => Promise<{ error: string | null }>
  onDeleteItem: (itemId: string) => Promise<{ error: string | null }>
  onDeleteList: () => Promise<{ error: string | null }>
}

export function TodoListCard({ list, onAddItem, onDeleteItem, onDeleteList }: Props) {
  const [newItem, setNewItem] = useState('')
  const [adding, setAdding] = useState(false)

  const completed = list.items.filter((i) => i.is_completed).length
  const total = list.items.length
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newItem.trim()) return
    setAdding(true)
    await onAddItem(newItem)
    setNewItem('')
    setAdding(false)
  }

  return (
    <div className="rounded-2xl border border-slate-100 p-5 bg-white">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-medium text-slate-700">{list.title}</h3>
          {list.due_date && (
            <p className="text-xs text-slate-400 mt-0.5">
              Due {new Date(list.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </p>
          )}
        </div>
        <button
          onClick={onDeleteList}
          className="text-slate-300 hover:text-rose-400 text-sm transition"
        >
          Delete list
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-violet-300 rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-xs text-slate-400 shrink-0">{completed}/{total}</span>
      </div>

      <ul className="space-y-1.5 mb-3">
        {list.items.map((item) => (
          <li key={item.id} className="flex items-center gap-2 group">
            <span
              className={`w-4 h-4 rounded-full border shrink-0 ${
                item.is_completed ? 'bg-violet-300 border-violet-300' : 'border-slate-300'
              }`}
            />
            <span className={`text-sm flex-1 ${item.is_completed ? 'text-slate-400 line-through' : 'text-slate-600'}`}>
              {item.content}
            </span>
            <button
              onClick={() => onDeleteItem(item.id)}
              className="text-slate-300 hover:text-rose-400 text-xs opacity-0 group-hover:opacity-100 transition"
            >
              ✕
            </button>
          </li>
        ))}
        {list.items.length === 0 && (
          <li className="text-sm text-slate-300 italic">No tasks yet</li>
        )}
      </ul>

      <form onSubmit={handleAdd} className="flex gap-2 pt-2 border-t border-slate-50">
        <input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add a task…"
          className="flex-1 text-sm rounded-lg border border-slate-200 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 transition"
        />
        <button
          type="submit"
          disabled={adding || !newItem.trim()}
          className="text-sm text-violet-400 hover:text-violet-500 disabled:opacity-40 transition px-2"
        >
          Add
        </button>
      </form>
    </div>
  )
}