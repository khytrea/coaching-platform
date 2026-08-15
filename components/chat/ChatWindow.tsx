'use client'

import { useEffect, useRef, useState } from 'react'
import { useMessages } from '@/hooks/useMessages'
import { MessageBubble } from '@/components/chat/MessageBubble'

type Props = {
  conversationId: string | null
  headerName?: string
  headerAvatar?: string | null
}

export function ChatWindow({ conversationId, headerName, headerAvatar }: Props) {
  const { messages, loading, sending, sendMessage, currentUserId } = useMessages(conversationId)
  const [draft, setDraft] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!draft.trim()) return
    const text = draft
    setDraft('') // optimistic clear
    const { error } = await sendMessage(text)
    if (error) setDraft(text) // restore on failure
  }

  if (!conversationId) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-300 text-sm">
        Select a conversation to start chatting
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {headerName && (
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
          <div className="w-9 h-9 rounded-full bg-violet-100 text-violet-500 flex items-center justify-center text-sm font-medium">
            {headerName.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()}
          </div>
          <p className="font-medium text-slate-700">{headerName}</p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`h-10 rounded-2xl bg-slate-100 animate-pulse ${i % 2 === 0 ? 'w-2/3' : 'w-1/2 ml-auto'}`}
              />
            ))}
          </div>
        ) : messages.length === 0 ? (
          <p className="text-center text-slate-300 text-sm mt-10">No messages yet — say hello 👋</p>
        ) : (
          messages.map((m) => (
            <MessageBubble key={m.id} message={m} isMine={m.sender_id === currentUserId} />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex items-center gap-2 px-4 py-3 border-t border-slate-100">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type a message…"
          className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 transition"
        />
        <button
          type="submit"
          disabled={sending || !draft.trim()}
          className="bg-violet-300 hover:bg-violet-400 text-white rounded-xl px-4 py-2.5 text-sm font-medium transition disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  )
}