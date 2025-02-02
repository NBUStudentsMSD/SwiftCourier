'use client';
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthContext from '@/context/AuthContext';

export default function withAuth(Component: any) {
  return function AuthComponent(props: any) {
    const auth = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
      if (!auth?.user) {
        router.push('/login');
      }
    }, [auth]);

    return auth?.user ? <Component {...props} /> : null;
  };
}
