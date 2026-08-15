'use client'

import { useState } from 'react'

type Props = {
  open: boolean
  onClose: () => void
  onSave: (title: string, dueDate: string | null, items: string[]) => Promise<{ error: string | null }>
}

export function CreateTodoListModal({ open, onClose, onSave }: Props) {
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [items, setItems] = useState<string[]>([''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!open) return null

  const reset = () => {
    setTitle('')
    setDueDate('')
    setItems([''])
    setError(null)
  }

  const updateItem = (index: number, value: string) => {
    setItems((prev) => prev.map((it, i) => (i === index ? value : it)))
  }

  const addItemRow = () => setItems((prev) => [...prev, ''])

  const removeItemRow = (index: number) => {
    setItems((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await onSave(title, dueDate || null, items)

    setLoading(false)
    if (error) {
      setError(error)
      return
    }
    reset()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-slate-800">New to-do list</h2>
          <button
            onClick={() => { reset(); onClose() }}
            className="text-slate-400 hover:text-slate-600 transition"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-slate-500 mb-1 block">List title</label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 transition"
              placeholder="Week 3 homework"
            />
          </div>

          <div>
            <label className="text-sm text-slate-500 mb-1 block">Due date (optional)</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 transition"
            />
          </div>

          <div>
            <label className="text-sm text-slate-500 mb-1 block">Tasks</label>
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={item}
                    onChange={(e) => updateItem(i, e.target.value)}
                    className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 transition"
                    placeholder={`Task ${i + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeItemRow(i)}
                    disabled={items.length === 1}
                    className="text-slate-300 hover:text-rose-400 transition disabled:opacity-30 px-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addItemRow}
              className="text-sm text-violet-400 hover:text-violet-500 mt-2 transition"
            >
              + Add task
            </button>
          </div>

          {error && (
            <p className="text-sm text-rose-400 bg-rose-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => { reset(); onClose() }}
              className="flex-1 rounded-xl py-2.5 text-slate-500 border border-slate-200 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl py-2.5 bg-violet-300 hover:bg-violet-400 text-white font-medium transition disabled:opacity-50"
            >
              {loading ? 'Creating…' : 'Create list'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}