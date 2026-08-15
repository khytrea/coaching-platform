import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Koçluk Platformuna Hoş Geldiniz</h1>
        <p className="text-slate-500 text-sm mb-6">Öğrenci takibi, takvim ve görev yönetim sisteminiz hazır.</p>
        
        <div className="flex flex-col gap-3">
          <Link 
            href="/admin" 
            className="w-full py-3 px-4 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition"
          >
            Eğitmen / Admin Paneli
          </Link>
          <Link 
            href="/student" 
            className="w-full py-3 px-4 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition"
          >
            Öğrenci Paneli
          </Link>
        </div>
      </div>
    </main>
  )
}