'use client'

import { useState } from 'react'
import { useSchedule, type ScheduleEvent } from '@/hooks/useSchedule'
import { CalendarView } from '@/components/calendar/CalendarView'
import { EventModal } from '@/components/calendar/EventModal'

export function ScheduleManager({ studentId }: { studentId: string }) {
  const { events, loading, createEvent, updateEvent, deleteEvent } = useSchedule(studentId)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null)
  const [slotRange, setSlotRange] = useState<{ start: Date; end: Date } | null>(null)

  const openNewEvent = (start: Date, end: Date) => {
    setEditingEvent(null)
    setSlotRange({ start, end })
    setModalOpen(true)
  }

  const openExistingEvent = (event: ScheduleEvent) => {
    setEditingEvent(event)
    setSlotRange(null)
    setModalOpen(true)
  }

  if (loading) {
    return <div className="h-96 rounded-2xl bg-slate-100 animate-pulse" />
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-400">Click a time slot to add an event, or click an existing event to edit it.</p>
        <button
          onClick={() => openNewEvent(new Date(), new Date(Date.now() + 60 * 60 * 1000))}
          className="bg-violet-300 hover:bg-violet-400 text-white text-sm font-medium rounded-xl px-4 py-2 transition"
        >
          + New event
        </button>
      </div>

      <CalendarView events={events} onSelectSlot={openNewEvent} onSelectEvent={openExistingEvent} />

      <EventModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={(input) => (editingEvent ? updateEvent(editingEvent.id, input) : createEvent(input))}
        onDelete={editingEvent ? () => deleteEvent(editingEvent.id) : undefined}
        initialStart={slotRange?.start ?? null}
        initialEnd={slotRange?.end ?? null}
        editingEvent={editingEvent}
      />
    </div>
  )
}