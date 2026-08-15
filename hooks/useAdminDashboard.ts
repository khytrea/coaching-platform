'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

export type UpcomingSession = {
  id: string
  title: string
  start_time: string
  color: string
  student_name: string
}

export type PendingTodoSummary = {
  student_id: string
  student_name: string
  list_title: string
  pending_count: number
}

export function useAdminDashboard() {
  const supabase = createClient()
  const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>([])
  const [pendingTodos, setPendingTodos] = useState<PendingTodoSummary[]>([])
  const [totalPendingTodos, setTotalPendingTodos] = useState(0)
  const [totalStudents, setTotalStudents] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchDashboard = useCallback(async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const [sessionsRes, todosRes, studentsRes] = await Promise.all([
      supabase
        .from('schedules')
        .select('id, title, start_time, color, student:profiles!schedules_student_id_fkey(full_name)')
        .eq('coach_id', user.id)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(5),
      supabase
        .from('todo_lists')
        .select('id, title, student_id, student:profiles!todo_lists_student_id_fkey(full_name), items:todo_items(is_completed)')
        .eq('coach_id', user.id),
      supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('coach_id', user.id),
    ])

    setUpcomingSessions(
      (sessionsRes.data ?? []).map((s: any) => ({
        id: s.id,
        title: s.title,
        start_time: s.start_time,
        color: s.color,
        student_name: s.student?.full_name ?? 'Unknown',
      }))
    )

    const summaries: PendingTodoSummary[] = []
    let total = 0
    ;(todosRes.data ?? []).forEach((list: any) => {
      const pending = list.items.filter((i: any) => !i.is_completed).length
      if (pending > 0) {
        summaries.push({
          student_id: list.student_id,
          student_name: list.student?.full_name ?? 'Unknown',
          list_title: list.title,
          pending_count: pending,
        })
        total += pending
      }
    })

    setPendingTodos(summaries.slice(0, 5))
    setTotalPendingTodos(total)
    setTotalStudents(studentsRes.count ?? 0)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchDashboard()
    const channel = supabase
      .channel('admin-dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'schedules' }, () => fetchDashboard())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'todo_items' }, () => fetchDashboard())
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [fetchDashboard])

  return { upcomingSessions, pendingTodos, totalPendingTodos, totalStudents, loading }
}