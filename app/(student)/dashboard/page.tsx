'use client'

import { useStudentDashboard } from '@/hooks/useStudentDashboard'
import { useUnreadCount } from '@/hooks/useUnreadCount'
import { StatCard } from '@/components/dashboard/StatCard'
import { DashboardCard } from '@/components/dashboard/DashboardCard'
import { UpcomingSessionsList } from '@/components/dashboard/UpcomingSessionsList'
import { PendingTodosList } from '@/components/dashboard/PendingTodosList'

export default function StudentDashboardPage() {
  const { upcoming, pendingLists, totalPending, loading } = useStudentDashboard()
  const unread = useUnreadCount()

  const nextSession = upcoming[0]

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-24 rounded-2xl bg-slate-100 animate-pulse" />)}
        </div>
        <div className="h-64 rounded-2xl bg-slate-100 animate-pulse" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold text-slate-800 mb-1">Your dashboard</h1>
      <p className="text-slate-400 text-sm mb-6">
        {nextSession
          ? `Next session: ${new Date(nextSession.start_time).toLocaleDateString(undefined, {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            })}`
          : 'No upcoming sessions scheduled'}
      </p>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Upcoming sessions" value={upcoming.length} icon="📅" tone="sky" />
        <StatCard label="Pending tasks" value={totalPending} icon="✅" tone="amber" />
        <StatCard label="Unread messages" value={unread} icon="💬" tone="rose" />
      </div>

      <div className="space-y-4">
        <DashboardCard title="Upcoming sessions" viewAllHref="/student/calendar">
          <UpcomingSessionsList
            sessions={upcoming.map((s) => ({ ...s, subtitle: s.location ?? undefined }))}
            emptyText="Nothing on the calendar yet"
          />
        </DashboardCard>

        <DashboardCard title="Pending tasks" viewAllHref="/student/todos">
          <PendingTodosList
            items={pendingLists.map((l) => ({
              id: l.id,
              title: l.title,
              subtitle: l.due_date
                ? `Due ${new Date(l.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`
                : undefined,
              count: l.pending_count,
            }))}
            emptyText="You're all caught up 🎉"
          />
        </DashboardCard>
      </div>
    </div>
  )
}