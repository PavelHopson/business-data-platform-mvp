import './globals.css'
import { Rubik } from 'next/font/google'

const rubik = Rubik({ subsets: ['latin', 'cyrillic'] })

export const metadata = {
  title: "GEORGE'S ANALYSIS - Проверка контрагентов",
  description: 'Быстрая и удобная проверка контрагентов',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={rubik.className}>{children}</body>
    </html>
  )
}
