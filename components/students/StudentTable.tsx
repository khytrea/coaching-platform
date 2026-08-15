'use client'

import Link from 'next/link'
import type { Student } from '@/hooks/useStudents'

type Props = {
  students: Student[]
  loading: boolean
}

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

const AVATAR_TONES = ['bg-rose-100 text-rose-500', 'bg-sky-100 text-sky-500', 'bg-violet-100 text-violet-500', 'bg-amber-100 text-amber-500']

export function StudentTable({ students, loading }: Props) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 rounded-2xl bg-slate-100 animate-pulse" />
        ))}
      </div>
    )
  }

  if (students.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400">
        <p className="text-lg mb-1">No students yet</p>
        <p className="text-sm">Add your first student to get started.</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-100 overflow-hidden bg-white">
      {students.map((student, i) => (
        <Link
          key={student.id}
          href={`/admin/students/${student.id}`}
          className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition border-b border-slate-50 last:border-0"
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm ${AVATAR_TONES[i % AVATAR_TONES.length]}`}>
            {initials(student.full_name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-slate-700 truncate">{student.full_name}</p>
            <p className="text-sm text-slate-400 truncate">{student.email}</p>
          </div>
          {student.phone && (
            <span className="hidden sm:block text-sm text-slate-400">{student.phone}</span>
          )}
          <span className="text-slate-300">›</span>
        </Link>
      ))}
    </div>
  )
}