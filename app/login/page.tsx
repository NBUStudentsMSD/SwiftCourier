'use client';
import { useState, useContext } from 'react';
import AuthContext from '@/context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await auth?.login(email, password);
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form onSubmit={handleSubmit} className="p-6 bg-white shadow-md rounded">
        <input
          type="text"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border mb-2"
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border mb-2"
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2">
          Login
        </button>
      </form>
    </div>
  );
}
