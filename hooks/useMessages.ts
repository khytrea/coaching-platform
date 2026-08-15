'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

export type Message = {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  is_read: boolean
  created_at: string
}

export function useMessages(conversationId: string | null) {
  const supabase = createClient()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const currentUserId = useRef<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      currentUserId.current = data.user?.id ?? null
    })
  }, [])

  const fetchMessages = useCallback(async () => {
    if (!conversationId) {
      setMessages([])
      setLoading(false)
      return
    }
    setLoading(true)
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    setMessages(data ?? [])
    setLoading(false)
  }, [conversationId])

  // Mark any messages not sent by me as read whenever I open/view this thread
  const markRead = useCallback(async () => {
    if (!conversationId || !currentUserId.current) return
    await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('conversation_id', conversationId)
      .eq('is_read', false)
      .neq('sender_id', currentUserId.current)
  }, [conversationId])

  useEffect(() => {
    fetchMessages().then(markRead)

    if (!conversationId) return

    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message])
          // If the incoming message isn't mine, mark it read since the thread is open
          if (payload.new.sender_id !== currentUserId.current) markRead()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId, fetchMessages, markRead])

  const sendMessage = useCallback(
    async (content: string) => {
      if (!conversationId || !content.trim()) return { error: 'Nothing to send' }
      setSending(true)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setSending(false)
        return { error: 'Not authenticated' }
      }

      const { error } = await supabase.from('messages').insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: content.trim(),
      })

      setSending(false)
      return { error: error?.message ?? null }
    },
    [conversationId]
  )

  return { messages, loading, sending, sendMessage, currentUserId: currentUserId.current }
}