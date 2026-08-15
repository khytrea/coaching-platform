'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

export type Student = {
  id: string
  full_name: string
  email: string
  phone: string | null
  avatar_url: string | null
  created_at: string
}

export function useStudents() {
  const supabase = createClient()
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStudents = useCallback(async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, email, phone, avatar_url, created_at')
      .eq('coach_id', user.id)
      .order('created_at', { ascending: false })

    if (error) setError(error.message)
    setStudents(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchStudents()

    const channel = supabase
      .channel('students-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        () => fetchStudents()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchStudents])

  return { students, loading, error, refetch: fetchStudents }
}