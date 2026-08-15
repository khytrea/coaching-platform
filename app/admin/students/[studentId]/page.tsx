import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { StudentDetailHeader } from '@/components/students/StudentDetailHeader'
import { StudentDetailTabs } from '@/components/students/StudentDetailTabs'

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ studentId: string }>
}) {
  const { studentId } = await params
  const supabase = await createClient()

  const { data: student, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, phone, avatar_url, created_at')
    .eq('id', studentId)
    .eq('role', 'student')
    .single()

  if (error || !student) notFound()

  return (
    <div className="max-w-4xl mx-auto">
      <StudentDetailHeader student={student} />
      <StudentDetailTabs studentId={student.id} />
    </div>
  )
}