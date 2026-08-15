// app/(student)/layout.tsx — same pattern
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { StudentSidebar } from '@/components/layout/StudentSidebar'

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'student') redirect('/admin/dashboard')

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <StudentSidebar />
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  )
}