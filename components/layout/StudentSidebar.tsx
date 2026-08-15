'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUnreadCount } from '@/hooks/useUnreadCount'

const NAV_ITEMS = [
  { href: '/student/dashboard', label: 'Dashboard', icon: '🏠' },
  { href: '/student/calendar', label: 'Calendar', icon: '📅' },
  { href: '/student/todos', label: 'To-Dos', icon: '✅' },
  { href: '/student/messages', label: 'Messages', icon: '💬', showBadge: true },
]

export function StudentSidebar() {
  const pathname = usePathname()
  const unread = useUnreadCount()

  return (
    <nav className="w-56 shrink-0 border-r border-slate-100 bg-white h-screen sticky top-0 flex flex-col py-6 px-3">
      <div className="px-3 mb-8">
        <p className="font-semibold text-slate-800">My Coaching</p>
      </div>
      <div className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition ${
                active ? 'bg-violet-100 text-violet-600 font-medium' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <span>{item.icon}</span>
                {item.label}
              </span>
              {item.showBadge && unread > 0 && (
                <span className="bg-rose-400 text-white text-[10px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}