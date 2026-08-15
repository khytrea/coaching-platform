// components/dashboard/StatCard.tsx
type Props = {
  label: string
  value: string | number
  icon: string
  tone?: 'violet' | 'rose' | 'amber' | 'sky'
}

const TONES = {
  violet: 'bg-violet-50 text-violet-500',
  rose: 'bg-rose-50 text-rose-500',
  amber: 'bg-amber-50 text-amber-500',
  sky: 'bg-sky-50 text-sky-500',
}

export function StatCard({ label, value, icon, tone = 'violet' }: Props) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg ${TONES[tone]}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-semibold text-slate-800">{value}</p>
        <p className="text-sm text-slate-400">{label}</p>
      </div>
    </div>
  )
}