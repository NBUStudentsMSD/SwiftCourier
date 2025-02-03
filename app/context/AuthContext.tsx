'use client';
import { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface Profile {
  id: number;
  username: string;
  user_id: number;
  role: string;
  company_id?: number;
  office_id?: number;
  emp_type?: string;
}

interface AuthContextType {
  user: string | null;
  profile: Profile | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser(token);
      fetchUserProfile();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data } = await api.post('/users/me');
      setProfile(data);
      redirectUser(data.role);
    } catch (error) {
      console.error('Failed to fetch user profile', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const redirectUser = (role: string) => {
    if (role === 'ADMIN' || role === 'EMPLOYEE') {
      router.push('/companies');
    } else {
      router.push('/dashboard');
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const { data } = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', data.token);
      setUser(data.token);
      await fetchUserProfile();
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setProfile(null);
    setIsLoading(false);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, profile, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
