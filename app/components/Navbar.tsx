'use client';
import { useContext } from 'react';
import Link from 'next/link';
import AuthContext from '@/context/AuthContext';

export default function Navbar() {
  const auth = useContext(AuthContext);

  //if (auth?.isLoading) return null; // Avoid flickering while loading user info

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <div>
        <Link href="/companies" className="text-xl font-bold">
          SwiftCourier
        </Link>
      </div>
      <div>
        {auth?.user ? (
          <>
            <span className="mr-4">
              {auth.profile?.username} ({auth.profile?.role})
            </span>
            <Link href="/dashboard" className="mr-4">Dashboard</Link>
            <button onClick={auth.logout} className="bg-red-500 px-4 py-2 rounded">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="mr-4">Login</Link>
            <Link href="/register" className="bg-blue-500 px-4 py-2 rounded">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
