'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ChatWindow } from '@/components/chat/ChatWindow'

export default function StudentMessagesPage() {
  const supabase = createClient()
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [coachName, setCoachName] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: myProfile } = await supabase
        .from('profiles')
        .select('coach_id')
        .eq('id', user.id)
        .single()

      if (!myProfile?.coach_id) {
        setLoading(false)
        return
      }

      const { data: coach } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', myProfile.coach_id)
        .single()

      setCoachName(coach?.full_name ?? 'Your coach')

      const { data: existing } = await supabase
        .from('conversations')
        .select('id')
        .eq('coach_id', myProfile.coach_id)
        .eq('student_id', user.id)
        .maybeSingle()

      if (existing) {
        setConversationId(existing.id)
      } else {
        const { data: created } = await supabase
          .from('conversations')
          .insert({ coach_id: myProfile.coach_id, student_id: user.id })
          .select('id')
          .single()
        setConversationId(created?.id ?? null)
      }

      setLoading(false)
    }

    init()
  }, [])

  if (loading) {
    return <div className="max-w-2xl mx-auto h-[70vh] rounded-2xl bg-slate-100 animate-pulse" />
  }

  if (!conversationId) {
    return (
      <div className="max-w-2xl mx-auto text-center text-slate-400 mt-16">
        You don't have a coach assigned yet.
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto h-[calc(100vh-8rem)]">
      <div className="h-full rounded-2xl border border-slate-100 bg-white overflow-hidden">
        <ChatWindow conversationId={conversationId} headerName={coachName} />
      </div>
    </div>
  )
}