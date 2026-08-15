'use client'

import { useState, useEffect } from 'react'
import type { ScheduleEvent, EventInput } from '@/hooks/useSchedule'

type Props = {
  open: boolean
  onClose: () => void
  onSave: (input: EventInput) => Promise<{ error: string | null }>
  onDelete?: () => Promise<{ error: string | null }>
  initialStart: Date | null
  initialEnd: Date | null
  editingEvent: ScheduleEvent | null
}

const EVENT_TYPES = [
  { value: 'session', label: 'Coaching session', color: '#c4b5fd' },
  { value: 'deadline', label: 'Deadline', color: '#fda4af' },
  { value: 'reminder', label: 'Reminder', color: '#fcd34d' },
  { value: 'custom', label: 'Custom', color: '#7dd3fc' },
]

function toLocalInput(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`
}

export function EventModal({
  open,
  onClose,
  onSave,
  onDelete,
  initialStart,
  initialEnd,
  editingEvent,
}: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [eventType, setEventType] = useState('session')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return

    if (editingEvent) {
      setTitle(editingEvent.title)
      setDescription(editingEvent.description ?? '')
      setEventType(editingEvent.event_type)
      setStart(toLocalInput(new Date(editingEvent.start_time)))
      setEnd(toLocalInput(new Date(editingEvent.end_time ?? editingEvent.start_time)))
      setLocation(editingEvent.location ?? '')
    } else {
      setTitle('')
      setDescription('')
      setEventType('session')
      setStart(initialStart ? toLocalInput(initialStart) : '')
      setEnd(initialEnd ? toLocalInput(initialEnd) : '')
      setLocation('')
    }
    setError(null)
  }, [open, editingEvent, initialStart, initialEnd])

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const startDate = new Date(start)
    const endDate = new Date(end)

    if (endDate < startDate) {
      setError('End time must be after start time')
      setLoading(false)
      return
    }

    const color = EVENT_TYPES.find((t) => t.value === eventType)?.color ?? '#c4b5fd'

    const { error } = await onSave({
      title,
      description,
      event_type: eventType,
      start_time: startDate,
      end_time: endDate,
      location,
      color,
    })

    setLoading(false)
    if (error) {
      setError(error)
      return
    }
    onClose()
  }

  const handleDelete = async () => {
    if (!onDelete) return
    setLoading(true)
    const { error } = await onDelete()
    setLoading(false)
    if (error) {
      setError(error)
      return
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-slate-800">
            {editingEvent ? 'Edit event' : 'New event'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-slate-500 mb-1 block">Title</label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 transition"
              placeholder="Weekly check-in"
            />
          </div>

          <div>
            <label className="text-sm text-slate-500 mb-1 block">Type</label>
            <div className="flex flex-wrap gap-2">
              {EVENT_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setEventType(t.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                    eventType === t.value
                      ? 'border-transparent text-slate-700'
                      : 'border-slate-200 text-slate-400 hover:text-slate-600'
                  }`}
                  style={eventType === t.value ? { backgroundColor: t.color } : {}}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-slate-500 mb-1 block">Start</label>
              <input
                type="datetime-local"
                required
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 transition"
              />
            </div>
            <div>
              <label className="text-sm text-slate-500 mb-1 block">End</label>
              <input
                type="datetime-local"
                required
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 transition"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-500 mb-1 block">Location / link (optional)</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 transition"
              placeholder="Zoom link or address"
            />
          </div>

          <div>
            <label className="text-sm text-slate-500 mb-1 block">Notes (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 transition resize-none"
              placeholder="Anything the student should prepare"
            />
          </div>

          {error && (
            <p className="text-sm text-rose-400 bg-rose-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            {editingEvent && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="rounded-xl px-4 py-2.5 text-rose-400 border border-rose-100 hover:bg-rose-50 transition disabled:opacity-50"
              >
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl py-2.5 text-slate-500 border border-slate-200 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl py-2.5 bg-violet-300 hover:bg-violet-400 text-white font-medium transition disabled:opacity-50"
            >
              {loading ? 'Saving…' : editingEvent ? 'Save changes' : 'Create event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}