'use client'

import { useState } from 'react'

type Props = {
  open: boolean
  onClose: () => void
  onCreated: () => void
}

export function AddStudentModal({ open, onClose, onCreated }: Props) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!open) return null

  const reset = () => {
    setFullName('')
    setEmail('')
    setPhone('')
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await fetch('/api/admin/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name: fullName, email, phone }),
    })

    const body = await res.json()

    if (!res.ok) {
      setError(body.error ?? 'Something went wrong')
      setLoading(false)
      return
    }

    setLoading(false)
    reset()
    onCreated()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-slate-800">Add a student</h2>
          <button
            onClick={() => { reset(); onClose() }}
            className="text-slate-400 hover:text-slate-600 transition"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-slate-500 mb-1 block">Full name</label>
            <input
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 transition"
              placeholder="Jamie Rivera"
            />
          </div>

          <div>
            <label className="text-sm text-slate-500 mb-1 block">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 transition"
              placeholder="jamie@example.com"
            />
          </div>

          <div>
            <label className="text-sm text-slate-500 mb-1 block">Phone (optional)</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 transition"
              placeholder="+1 555 123 4567"
            />
          </div>

          {error && (
            <p className="text-sm text-rose-400 bg-rose-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <p className="text-xs text-slate-400">
            The student will receive an email invite to set their password and log in.
          </p>

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
              {loading ? 'Sending…' : 'Send invite'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}