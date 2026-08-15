'use client'

import { useState, useMemo } from 'react'
import { useStudents } from '@/hooks/useStudents'
import { StudentTable } from '@/components/students/StudentTable'
import { AddStudentModal } from '@/components/students/AddStudentModal'

export default function StudentsPage() {
  const { students, loading, refetch } = useStudents()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  const filtered = useMemo(() => {
    if (!search.trim()) return students
    const q = search.toLowerCase()
    return students.filter(
      (s) => s.full_name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
    )
  }, [students, search])

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Students</h1>
          <p className="text-slate-400 text-sm mt-1">
            {students.length} {students.length === 1 ? 'student' : 'students'}
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-violet-300 hover:bg-violet-400 text-white font-medium rounded-xl px-5 py-2.5 transition"
        >
          + Add student
        </button>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search students..."
        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 mb-5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 transition"
      />

      <StudentTable students={filtered} loading={loading} />

      <AddStudentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={refetch}
      />
    </div>
  )
}