import Image from 'next/image'
import { PWCApportioning, Apportioning } from '@/components'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* <PWCApportioning /> */}
      <Apportioning/>
    </main>
  )
}
