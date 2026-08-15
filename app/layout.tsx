import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Koçluk Platformu',
  description: 'Öğrenci takip ve yönetim sistemi',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className="bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  )
}