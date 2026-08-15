'use client'

import { useState } from 'react'
import { useTodoLists } from '@/hooks/useTodoLists'
import { TodoListCard } from '@/components/todos/TodoListCard'
import { CreateTodoListModal } from '@/components/todos/CreateTodoListModal'
import { EmptyState } from '@/components/todos/EmptyState'

export function TodoManager({ studentId }: { studentId: string }) {
  const { lists, loading, createList, addItem, deleteItem, deleteList } = useTodoLists(studentId)
  const [modalOpen, setModalOpen] = useState(false)

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-40 rounded-2xl bg-slate-100 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-400">
          {lists.length} {lists.length === 1 ? 'list' : 'lists'} assigned
        </p>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-violet-300 hover:bg-violet-400 text-white text-sm font-medium rounded-xl px-4 py-2 transition"
        >
          + New list
        </button>
      </div>

      {lists.length === 0 ? (
        <EmptyState title="No to-do lists yet" subtitle="Assign your first task list to this student." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {lists.map((list) => (
            <TodoListCard
              key={list.id}
              list={list}
              onAddItem={(content) => addItem(list.id, content, list.items.length)}
              onDeleteItem={deleteItem}
              onDeleteList={() => deleteList(list.id)}
            />
          ))}
        </div>
      )}

      <CreateTodoListModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={createList} />
    </div>
  )
}