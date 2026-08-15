'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

export type ScheduleEvent = {
  id: string
  student_id: string
  coach_id: string
  title: string
  description: string | null
  event_type: string
  start_time: string
  end_time: string | null
  location: string | null
  color: string
}

export type EventInput = {
  title: string
  description: string
  event_type: string
  start_time: Date
  end_time: Date
  location: string
  color: string
}

export function useSchedule(studentId: string) {
  const supabase = createClient()
  const [events, setEvents] = useState<ScheduleEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .eq('student_id', studentId)
      .order('start_time', { ascending: true })

    if (error) setError(error.message)
    setEvents(data ?? [])
    setLoading(false)
  }, [studentId])

  useEffect(() => {
    fetchEvents()

    const channel = supabase
      .channel(`schedule-${studentId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'schedules', filter: `student_id=eq.${studentId}` },
        () => fetchEvents()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [studentId, fetchEvents])

  const createEvent = useCallback(
    async (input: EventInput) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return { error: 'Not authenticated' }

      const { error } = await supabase.from('schedules').insert({
        student_id: studentId,
        coach_id: user.id,
        title: input.title,
        description: input.description || null,
        event_type: input.event_type,
        start_time: input.start_time.toISOString(),
        end_time: input.end_time.toISOString(),
        location: input.location || null,
        color: input.color,
      })

      return { error: error?.message ?? null }
    },
    [studentId]
  )

  const updateEvent = useCallback(async (id: string, input: EventInput) => {
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
      .eq('id', id)

    return { error: error?.message ?? null }
  }, [])

  const deleteEvent = useCallback(async (id: string) => {
    const { error } = await supabase.from('schedules').delete().eq('id', id)
    return { error: error?.message ?? null }
  }, [])

  return { events, loading, error, createEvent, updateEvent, deleteEvent, refetch: fetchEvents }
}