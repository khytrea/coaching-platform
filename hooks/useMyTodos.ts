'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { TodoList } from '@/hooks/useTodoLists'

export function useMyTodos() {
  const supabase = createClient()
  const [lists, setLists] = useState<TodoList[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLists = useCallback(async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('todo_lists')
      .select('*, items:todo_items(*)')
      .eq('student_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    const sorted = (data ?? []).map((list) => ({
      ...list,
      items: [...list.items].sort((a, b) => a.order_index - b.order_index),
    }))

    setLists(sorted)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchLists()

    const channel = supabase
      .channel('my-todos')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'todo_lists' }, () => fetchLists())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'todo_items' }, () => fetchLists())
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchLists])

  const toggleItem = useCallback(async (itemId: string, currentState: boolean) => {
    const { error } = await supabase
      .from('todo_items')
      .update({
        is_completed: !currentState,
        completed_at: !currentState ? new Date().toISOString() : null,
      })
      .eq('id', itemId)

    return { error: error?.message ?? null }
  }, [])

  return { lists, loading, error, toggleItem }
}