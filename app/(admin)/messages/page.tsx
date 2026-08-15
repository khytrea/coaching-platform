'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useConversations } from '@/hooks/useConversations'
import { ConversationListItem } from '@/components/chat/ConversationListItem'
import { ChatWindow } from '@/components/chat/ChatWindow'

export default function AdminMessagesPage() {
  const { conversations, loading, getOrCreateConversation } = useConversations()
  const [activeId, setActiveId] = useState<string | null>(null)
  const searchParams = useSearchParams()

  // Deep-link support: /admin/messages?student=<studentId>
  useEffect(() => {
    const studentId = searchParams.get('student')
    if (!studentId) return
    getOrCreateConversation(studentId).then(({ id }) => {
      if (id) setActiveId(id)
    })
  }, [searchParams, getOrCreateConversation])

  const active = conversations.find((c) => c.id === activeId)

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-8rem)]">
      <div className="flex h-full rounded-2xl border border-slate-100 bg-white overflow-hidden">
        <div className="w-72 border-r border-slate-100 flex flex-col shrink-0">
          <div className="px-5 py-4 border-b border-slate-100">
            <h1 className="font-semibold text-slate-800">Messages</h1>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 rounded-xl bg-slate-100 animate-pulse" />
                ))}
              </div>
            ) : conversations.length === 0 ? (
              <p className="text-center text-slate-300 text-sm mt-10 px-4">
                No conversations yet — message a student from their profile.
              </p>
            ) : (
              conversations.map((c) => (
                <ConversationListItem
                  key={c.id}
                  conversation={c}
                  active={c.id === activeId}
                  onClick={() => setActiveId(c.id)}
                />
              ))
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <ChatWindow
            conversationId={activeId}
            headerName={active?.student_name}
            headerAvatar={active?.student_avatar}
          />
        </div>
      </div>
    </div>
  )
}