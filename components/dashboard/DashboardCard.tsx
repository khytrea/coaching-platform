// components/dashboard/DashboardCard.tsx
import Link from 'next/link'

export function DashboardCard({
  title,
  viewAllHref,
  children,
}: {
  title: string
  viewAllHref?: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-medium text-slate-700">{title}</h2>
        {viewAllHref && (
          <Link href={viewAllHref} className="text-xs text-violet-400 hover:text-violet-500 transition">
            View all →
          </Link>
        )}
      </div>
      {children}
    </div>
  )
}