'use client'

import Link from 'next/link'
import { useAdminDashboard } from '@/hooks/useAdminDashboard'
import { useConversations } from '@/hooks/useConversations'
import { StatCard } from '@/components/dashboard/StatCard'
import { DashboardCard } from '@/components/dashboard/DashboardCard'
import { UpcomingSessionsList } from '@/components/dashboard/UpcomingSessionsList'
import { PendingTodosList } from '@/components/dashboard/PendingTodosList'
import { ConversationListItem } from '@/components/chat/ConversationListItem'

export default function AdminDashboardPage() {
  const { upcomingSessions, pendingTodos, totalPendingTodos, totalStudents, loading } = useAdminDashboard()
  const { conversations, loading: convosLoading } = useConversations()

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread_count, 0)
  const recentConversations = conversations.slice(0, 4)

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-24 rounded-2xl bg-slate-100 animate-pulse" />)}
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="h-64 rounded-2xl bg-slate-100 animate-pulse" />
          <div className="h-64 rounded-2xl bg-slate-100 animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold text-slate-800 mb-1">Welcome back</h1>
      <p className="text-slate-400 text-sm mb-6">Here's what's happening with your students</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Students" value={totalStudents} icon="👥" tone="violet" />
        <StatCard label="Upcoming sessions" value={upcomingSessions.length} icon="📅" tone="sky" />
        <StatCard label="Pending tasks" value={totalPendingTodos} icon="✅" tone="amber" />
        <StatCard label="Unread messages" value={totalUnread} icon="💬" tone="rose" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <DashboardCard title="Upcoming sessions" viewAllHref="/admin/calendar">
          <UpcomingSessionsList
            sessions={upcomingSessions.map((s) => ({ ...s, subtitle: s.student_name }))}
            emptyText="No sessions scheduled"
          />
        </DashboardCard>

        <DashboardCard title="Pending tasks" viewAllHref="/admin/students">
          <PendingTodosList
            items={pendingTodos.map((t) => ({
              id: `${t.student_id}-${t.list_title}`,
              title: t.list_title,
              subtitle: t.student_name,
              count: t.pending_count,
            }))}
            emptyText="Nothing pending — nice work"
          />
        </DashboardCard>
      </div>

      <div className="mt-4">
        <DashboardCard title="Recent conversations" viewAllHref="/admin/messages">
          {convosLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => <div key={i} className="h-12 rounded-xl bg-slate-100 animate-pulse" />)}
            </div>
          ) : recentConversations.length === 0 ? (
            <p className="text-sm text-slate-300 py-6 text-center">No conversations yet</p>
          ) : (
            <div className="-mx-5 divide-y divide-slate-50">
              {recentConversations.map((c) => (
                <Link key={c.id} href={`/admin/messages?student=${c.student_id}`}>
                  <ConversationListItem conversation={c} active={false} onClick={() => {}} />
                </Link>
              ))}
            </div>
          )}
        </DashboardCard>
      </div>
    </div>
  )
}