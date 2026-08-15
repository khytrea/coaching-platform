'use client'

import { useRouter } from 'next/navigation'
import type { Student } from '@/hooks/useStudents'

export function StudentDetailHeader({ student }: { student: Student }) {
  const router = useRouter()

  return (
    <div className="flex items-center gap-4 mb-6">
      <button
        onClick={() => router.push('/admin/students')}
        className="text-slate-400 hover:text-slate-600 transition"
      >
        ← Back
      </button>
      <div className="w-12 h-12 rounded-full bg-violet-100 text-violet-500 flex items-center justify-center font-medium">
        {student.full_name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()}
      </div>
      <div>
        <h1 className="text-xl font-semibold text-slate-800">{student.full_name}</h1>
        <p className="text-sm text-slate-400">{student.email}</p>
      </div>
    </div>
  )
}