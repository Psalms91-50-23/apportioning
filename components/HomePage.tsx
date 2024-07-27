'use client';
import { useRouter } from 'next/navigation'
import React from 'react'

const HomePage = () => {
    const router = useRouter();
    const navigateToPage = (page: string) => {
      router.push(`/${page}`);
    };

  return (
    <div className='bg-green-400'>
        <div className="">
            <div className="space-x-5">
              <button onClick={() => navigateToPage('apportioning')} className="btn">
                  Go to Apportioning
              </button>
              <button onClick={() => navigateToPage('backpayments')} className="btn">
                  Go to Backpayments
              </button>
              <button onClick={() => navigateToPage('tester')} className="btn">
                  Go to Tester
              </button>
              <button onClick={() => router.back()} className="btn">
                  Go Back
              </button>
            </div>
        </div>
    </div>
  )
}


export default HomePage