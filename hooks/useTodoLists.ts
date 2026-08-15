'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

export type TodoItem = {
  id: string
  list_id: string
  content: string
  is_completed: boolean
  order_index: number
}

export type TodoList = {
  id: string
  student_id: string
  coach_id: string
  title: string
  due_date: string | null
  created_at: string
  items: TodoItem[]
}

export function useTodoLists(studentId: string) {
  const supabase = createClient()
  const [lists, setLists] = useState<TodoList[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLists = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('todo_lists')
      .select('*, items:todo_items(*)')
      .eq('student_id', studentId)
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
  }, [studentId])

  useEffect(() => {
    fetchLists()

    const channel = supabase
      .channel(`todos-${studentId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'todo_lists' }, () => fetchLists())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'todo_items' }, () => fetchLists())
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [studentId, fetchLists])

  const createList = useCallback(
    async (title: string, dueDate: string | null, itemContents: string[]) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return { error: 'Not authenticated' }

      const { data: list, error: listError } = await supabase
        .from('todo_lists')
        .insert({ student_id: studentId, coach_id: user.id, title, due_date: dueDate })
        .select()
        .single()

      if (listError || !list) return { error: listError?.message ?? 'Failed to create list' }

      const validItems = itemContents.filter((c) => c.trim())
      if (validItems.length > 0) {
        const { error: itemsError } = await supabase.from('todo_items').insert(
          validItems.map((content, i) => ({
            list_id: list.id,
            content: content.trim(),
            order_index: i,
          }))
        )
        if (itemsError) return { error: itemsError.message }
      }

      return { error: null }
    },
    [studentId]
  )

  const addItem = useCallback(async (listId: string, content: string, orderIndex: number) => {
    const { error } = await supabase
      .from('todo_items')
      .insert({ list_id: listId, content: content.trim(), order_index: orderIndex })
    return { error: error?.message ?? null }
  }, [])

  const deleteItem = useCallback(async (itemId: string) => {
    const { error } = await supabase.from('todo_items').delete().eq('id', itemId)
    return { error: error?.message ?? null }
  }, [])

  const deleteList = useCallback(async (listId: string) => {
    const { error } = await supabase.from('todo_lists').delete().eq('id', listId)
    return { error: error?.message ?? null }
  }, [])

  return { lists, loading, error, createList, addItem, deleteItem, deleteList, refetch: fetchLists }
}