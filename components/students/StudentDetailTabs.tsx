'use client'

import { useState } from 'react'
import { ScheduleManager } from '@/components/students/ScheduleManager'
import { TodoManager } from '@/components/students/TodoManager'


type Tab = 'overview' | 'schedule' | 'todos' | 'messages'

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'todos', label: 'To-Dos' },
  { id: 'messages', label: 'Messages' },
]

export function StudentDetailTabs({ studentId }: { studentId: string }) {
  const [active, setActive] = useState<Tab>('overview')

  return (
    <div>
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-6 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              active === tab.id
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-6 min-h-[300px]">
        {active === 'overview' && (
          <p className="text-slate-400 text-sm">
            Quick summary — upcoming sessions, pending to-dos, recent messages. (Wire up once
            schedule/todo modules exist.)
          </p>
        )}
        {active === 'schedule' && <ScheduleManager studentId={studentId} />}
        {active === 'todos' && <TodoManager studentId={studentId} />}
        )}
        {active === 'messages' && (
          <p className="text-slate-400 text-sm">
            {/* <ChatWindow studentId={studentId} /> */}
            Chat placeholder.
          </p>
        )}
      </div>
    </div>
  )
}