'use client';
import React from 'react';

const Header = () => {
  return (
    <header className="bg-green-500 text-white w-full">
      <h1 className="text-2xl">My Application</h1>
      <nav>
        <ul className="flex space-x-4">
          <li><a href="/" className="hover:underline">Home</a></li>
          <li><a href="/apportioning" className="hover:underline">Apportioning</a></li>
          <li><a href="/backpayments" className="hover:underline">Backpayments</a></li>
          <li><a href="/ezy-apportioning" className="hover:underline">EzyApportioning</a></li>
          <li><a href="/tester" className="hover:underline">Tester</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;