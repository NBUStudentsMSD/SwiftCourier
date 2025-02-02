'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';

import { useRouter } from 'next/navigation';

interface Company {
  id: number;
  name: string;
}

interface Office {
  id: number;
  name: string;
}

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CLIENT'); // Default role
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [officeId, setOfficeId] = useState<number | null>(null);
  const [employeeType, setEmployeeType] = useState<string | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [offices, setOffices] = useState<Office[]>([]);
  const [error, setError] = useState('');
  //const auth = useContext(AuthContext);
  const router = useRouter();


  // Fetch companies when the component mounts
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await api.get('/companies');
        setCompanies(response.data);
      } catch (err) {
        console.error('Failed to fetch companies', err);
      }
    };
    fetchCompanies();
  }, []);

  // Fetch offices when a company is selected
  useEffect(() => {
    const fetchOffices = async () => {
      if (!companyId) return;
      try {
        const response = await api.get(`/offices/company/${companyId}`);
        setOffices(response.data);
      } catch (err) {
        console.error('Failed to fetch offices', err);
      }
    };
    fetchOffices();
  }, [companyId]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await api.post('/auth/register', {
        username,
        password,
        role,
        company_id: companyId, // Always required
        office_id: role === 'EMPLOYEE' ? officeId : null, // Office only for EMPLOYEE
        employeeType: role === 'EMPLOYEE' ? employeeType : null, // Employee Type only for EMPLOYEE
      });
      router.replace('/login');

    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold text-center mb-4">Register</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <form onSubmit={handleRegister} className="p-6 bg-white shadow-md rounded">
        {/* Username Field */}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border mb-2"
          required
        />

        {/* Password Field */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border mb-2"
          required
        />

        {/* Role Selection */}
        <label className="block mb-2">Select Role:</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-2 border mb-2"
        >
          <option value="CLIENT">CLIENT</option>
          <option value="EMPLOYEE">EMPLOYEE</option>
        </select>

        {/* Company Selection (For both CLIENT and EMPLOYEE) */}
        <label className="block mb-2">Select Company:</label>
        <select
          value={companyId || ''}
          onChange={(e) => setCompanyId(Number(e.target.value))}
          className="w-full p-2 border mb-2"
        >
          <option value="" disabled>Select a company</option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>

        {/* Office Selection (Only for EMPLOYEEs) */}
        {role === 'EMPLOYEE' && companyId && (
          <>
            <label className="block mb-2">Select Office:</label>
            <select
              value={officeId || ''}
              onChange={(e) => setOfficeId(Number(e.target.value))}
              className="w-full p-2 border mb-2"
            >
              <option value="" disabled>Select an office</option>
              {offices.map((office) => (
                <option key={office.id} value={office.id}>
                  {office.name}
                </option>
              ))}
            </select>
          </>
        )}

        {/* Employee Type Selection (Only for EMPLOYEEs) */}
        {role === 'EMPLOYEE' && (
          <>
            <label className="block mb-2">Select Employee Type:</label>
            <select
              value={employeeType || ''}
              onChange={(e) => setEmployeeType(e.target.value)}
              className="w-full p-2 border mb-2"
            >
              <option value="" disabled>Select employee type</option>
              <option value="CASHIER">CASHIER</option>
              <option value="COURIER">COURIER</option>
            </select>
          </>
        )}

        {/* Submit Button */}
        <button type="submit" className="w-full bg-blue-500 text-white p-2">
          Register
        </button>
      </form>
    </div>
  );
}
