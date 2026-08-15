'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CalendarView } from '@/components/calendar/CalendarView'
import { EventModal } from '@/components/calendar/EventModal'
import type { ScheduleEvent, EventInput } from '@/hooks/useSchedule'

export default function AdminCalendarPage() {
  const supabase = createClient()
  const [events, setEvents] = useState<ScheduleEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('schedules')
      .select('*')
      .eq('coach_id', user.id)
      .order('start_time', { ascending: true })

    setEvents(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchAll()
    const channel = supabase
      .channel('coach-all-schedule')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'schedules' }, () => fetchAll())
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchAll])

  const handleUpdate = async (input: EventInput) => {
    if (!editingEvent) return { error: 'No event selected' }
    const { error } = await supabase
      .from('schedules')
      .update({
        title: input.title,
        description: input.description || null,
        event_type: input.event_type,
        start_time: input.start_time.toISOString(),
        end_time: input.end_time.toISOString(),
        location: input.location || null,
        color: input.color,
      })
      .eq('id', editingEvent.id)
    return { error: error?.message ?? null }
  }

  const handleDelete = async () => {
    if (!editingEvent) return { error: 'No event selected' }
    const { error } = await supabase.from('schedules').delete().eq('id', editingEvent.id)
    return { error: error?.message ?? null }
  }

  if (loading) return <div className="h-96 rounded-2xl bg-slate-100 animate-pulse" />

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold text-slate-800 mb-1">All sessions</h1>
      <p className="text-slate-400 text-sm mb-6">
        A combined view across all your students. Click an event to view or edit it — new events
        should be created from a student's profile so they're linked correctly.
      </p>

      <CalendarView
        events={events}
        onSelectSlot={() => {}} // creation happens from the student page, not here
        onSelectEvent={(e) => {
          setEditingEvent(e)
          setModalOpen(true)
        }}
      />

      <EventModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleUpdate}
        onDelete={handleDelete}
        initialStart={null}
        initialEnd={null}
        editingEvent={editingEvent}
      />
    </div>
  )
}