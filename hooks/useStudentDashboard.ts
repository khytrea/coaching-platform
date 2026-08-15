'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

export type StudentUpcoming = {
  id: string
  title: string
  start_time: string
  color: string
  location: string | null
}

export type StudentPendingList = {
  id: string
  title: string
  due_date: string | null
  pending_count: number
}

export function useStudentDashboard() {
  const supabase = createClient()
  const [upcoming, setUpcoming] = useState<StudentUpcoming[]>([])
  const [pendingLists, setPendingLists] = useState<StudentPendingList[]>([])
  const [totalPending, setTotalPending] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchDashboard = useCallback(async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const [sessionsRes, listsRes] = await Promise.all([
      supabase
        .from('schedules')
        .select('id, title, start_time, color, location')
        .eq('student_id', user.id)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(5),
      supabase
        .from('todo_lists')
        .select('id, title, due_date, items:todo_items(is_completed)')
        .eq('student_id', user.id),
    ])

    setUpcoming(sessionsRes.data ?? [])

    let total = 0
    const lists: StudentPendingList[] = []
    ;(listsRes.data ?? []).forEach((list: any) => {
      const pending = list.items.filter((i: any) => !i.is_completed).length
      if (pending > 0) {
        lists.push({ id: list.id, title: list.title, due_date: list.due_date, pending_count: pending })
        total += pending
      }
    })

    setPendingLists(lists)
    setTotalPending(total)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchDashboard()
    const channel = supabase
      .channel('student-dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'schedules' }, () => fetchDashboard())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'todo_items' }, () => fetchDashboard())
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [fetchDashboard])

  return { upcoming, pendingLists, totalPending, loading }
}