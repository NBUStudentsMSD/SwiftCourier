import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import { AuthProvider } from '@/context/AuthContext';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'My App',
  description: 'Next.js App with Authentication',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
    <body>
    <AuthProvider>
      <Navbar /> {/* Navbar is now aware of user state */}
      <main className="container mx-auto p-4">{children}</main>
    </AuthProvider>
    </body>
    </html>
  );
}
