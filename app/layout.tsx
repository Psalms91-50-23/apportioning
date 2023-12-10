import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ezy Apportioning',
  description: 'Created for an ezy life of apportioning',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="display:relative flex w-full h-full items-center justify-center bg-green-400">{children}</body>
    </html>
  )
}
