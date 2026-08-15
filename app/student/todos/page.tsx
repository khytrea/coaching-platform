'use client'

import { useMyTodos } from '@/hooks/useMyTodos'
import { StudentTodoCard } from '@/components/todos/StudentTodoCard'
import { EmptyState } from '@/components/todos/EmptyState'

export default function MyTodosPage() {
  const { lists, loading, toggleItem } = useMyTodos()

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-3">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-48 rounded-2xl bg-slate-100 animate-pulse" />
        ))}
      </div>
    )
  }

  const activeLists = lists.filter((l) => l.items.some((i) => !i.is_completed))
  const completedLists = lists.filter((l) => l.items.length > 0 && l.items.every((i) => i.is_completed))

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold text-slate-800 mb-1">My To-Dos</h1>
      <p className="text-slate-400 text-sm mb-6">Tasks assigned by your coach</p>

      {lists.length === 0 ? (
        <EmptyState title="Nothing assigned yet" subtitle="Your coach hasn't added any tasks." />
      ) : (
        <div className="space-y-6">
          {activeLists.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {activeLists.map((list) => (
                <StudentTodoCard key={list.id} list={list} onToggle={toggleItem} />
              ))}
            </div>
          )}

          {completedLists.length > 0 && (
            <div>
              <p className="text-sm text-slate-400 mb-3">Completed</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {completedLists.map((list) => (
                  <StudentTodoCard key={list.id} list={list} onToggle={toggleItem} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}