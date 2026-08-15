import type { ConversationSummary } from '@/hooks/useConversations'

type Props = {
  conversation: ConversationSummary
  active: boolean
  onClick: () => void
}

export function ConversationListItem({ conversation, active, onClick }: Props) {
  const time = conversation.last_message_at
    ? new Date(conversation.last_message_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    : ''

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition ${
        active ? 'bg-violet-50' : 'hover:bg-slate-50'
      }`}
    >
      <div className="relative shrink-0">
        <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-500 flex items-center justify-center text-sm font-medium">
          {conversation.student_name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()}
        </div>
        {conversation.unread_count > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-400 text-white text-[10px] flex items-center justify-center">
            {conversation.unread_count > 9 ? '9+' : conversation.unread_count}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className={`text-sm truncate ${conversation.unread_count > 0 ? 'font-semibold text-slate-800' : 'font-medium text-slate-700'}`}>
            {conversation.student_name}
          </p>
          <span className="text-xs text-slate-300 shrink-0">{time}</span>
        </div>
        <p className={`text-xs truncate ${conversation.unread_count > 0 ? 'text-slate-600' : 'text-slate-400'}`}>
          {conversation.last_message ?? 'No messages yet'}
        </p>
      </div>
    </button>
  )
}