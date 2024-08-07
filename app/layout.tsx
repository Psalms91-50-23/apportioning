
import { Navigation, ClientSideScript } from '../components'; 
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ezy Apportioning',
  description: 'Created for an Ezy life of Apportioning',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({ children, }: { children: React.ReactNode }) {

  return (
    <html lang="en" className='flex justify-center' >
      <body 
      className="display:relative flex w-full min-h-screen items-center justify-center bg-green-400" 
      >
      <div className="min-h-screen max-width-container">
        <Navigation /> 
        <ClientSideScript />
        <main className="flex flex-1 justify-start px-10 items-start">
          {children}
        </main>
      </div>
      </body>
    </html>
  )
}

