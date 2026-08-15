'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

export type ConversationSummary = {
  id: string
  student_id: string
  student_name: string
  student_avatar: string | null
  last_message: string | null
  last_message_at: string | null
  unread_count: number
}

export function useConversations() {
  const supabase = createClient()
  const [conversations, setConversations] = useState<ConversationSummary[]>([])
  const [loading, setLoading] = useState(true)

  const fetchConversations = useCallback(async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // One round trip: conversations joined with the student profile,
    // plus their messages so we can derive "last message" and unread count client-side.
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        id,
        student_id,
        student:profiles!conversations_student_id_fkey ( full_name, avatar_url ),
        messages ( content, created_at, is_read, sender_id )
      `)
      .eq('coach_id', user.id)

    if (error || !data) {
      setLoading(false)
      return
    }

    const summaries: ConversationSummary[] = data.map((c: any) => {
      const msgs = [...c.messages].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )
      const last = msgs[msgs.length - 1]
      const unread = msgs.filter((m) => !m.is_read && m.sender_id !== user.id).length

      return {
        id: c.id,
        student_id: c.student_id,
        student_name: c.student?.full_name ?? 'Unknown student',
        student_avatar: c.student?.avatar_url ?? null,
        last_message: last?.content ?? null,
        last_message_at: last?.created_at ?? null,
        unread_count: unread,
      }
    })

    summaries.sort((a, b) => {
      if (!a.last_message_at) return 1
      if (!b.last_message_at) return -1
      return new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
    })

    setConversations(summaries)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchConversations()

    const channel = supabase
      .channel('admin-inbox')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => fetchConversations())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, () => fetchConversations())
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchConversations])

  // Ensures a conversation row exists for a student, returns its id.
  // Needed when the admin opens a student who hasn't been messaged yet.
  const getOrCreateConversation = useCallback(async (studentId: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { id: null, error: 'Not authenticated' }

    const { data: existing } = await supabase
      .from('conversations')
      .select('id')
      .eq('coach_id', user.id)
      .eq('student_id', studentId)
      .maybeSingle()

    if (existing) return { id: existing.id, error: null }

    const { data: created, error } = await supabase
      .from('conversations')
      .insert({ coach_id: user.id, student_id: studentId })
      .select('id')
      .single()

    return { id: created?.id ?? null, error: error?.message ?? null }
  }, [])

  return { conversations, loading, refetch: fetchConversations, getOrCreateConversation }
}