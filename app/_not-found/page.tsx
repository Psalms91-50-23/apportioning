import React from 'react';
// import { notFound } from 'next/navigation';

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="mt-4 text-lg">The page you're looking for doesn't exist.</p>
      <a href="/" className="mt-4 text-blue-500 hover:underline">Go back to the homepage</a>
    </div>
  );
}