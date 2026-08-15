'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useUnreadCount() {
  const supabase = createClient()
  const [count, setCount] = useState(0)

  const fetchCount = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // RLS already restricts this to messages in conversations the user belongs to
    const { count: unread } = await supabase
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .eq('is_read', false)
      .neq('sender_id', user.id)

    setCount(unread ?? 0)
  }, [])

  useEffect(() => {
    fetchCount()
    const channel = supabase
      .channel('unread-count')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => fetchCount())
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [fetchCount])

  return count
}