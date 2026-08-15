import type { Message } from '@/hooks/useMessages'

export function MessageBubble({ message, isMine }: { message: Message; isMine: boolean }) {
  const time = new Date(message.created_at).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  })

  return (
    <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
          isMine
            ? 'bg-violet-300 text-white rounded-br-md'
            : 'bg-slate-100 text-slate-700 rounded-bl-md'
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        <p className={`text-[10px] mt-1 ${isMine ? 'text-violet-100' : 'text-slate-400'}`}>
          {time}
        </p>
      </div>
    </div>
  )
}