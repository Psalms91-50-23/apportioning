import Head from 'next/head';
import { Apportioning } from '@/components'

export default function Home() {
  return (
    <>
      <Head>
        <title>Apportioning</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <Apportioning/>
      </main>
    </>
  )
}
