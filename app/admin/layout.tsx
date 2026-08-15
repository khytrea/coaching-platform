import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/student/dashboard')

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar nav goes here — students, calendar, messages */}
      <main className="p-6">{children}</main>
    </div>
  )
}