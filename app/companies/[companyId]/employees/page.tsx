'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';

interface Employee {
  id: number;
  user: {
    id: number;
    username: string;
    role: string;
  };
  office: {
    id: number;
    name: string;
    address: string;
  };
  company: {
    id: number;
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  employeeType: string;
}

export default function EmployeesPage() {
  const params = useParams();
  const companyId = parseInt(params.companyId as string);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [company, setCompany] = useState<Employee['company'] | null>(null);

  // Fetch employees for the company
  useEffect(() => {
    const fetchEmployees = async () => {
      if (!companyId) return;
      try {
        const response = await api.get(`/employees/company/${companyId}`);
        setEmployees(response.data);

        // Extract company details from the first employee
        if (response.data.length > 0) {
          setCompany(response.data[0].company);
        }
      } catch (error) {
        console.error('Failed to fetch employees', error);
      }
    };
    fetchEmployees();
  }, [companyId]);

  return (
    <div className="max-w-4xl mx-auto mt-10">
      {company && (
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold">{company.name}</h2>
          <p className="text-gray-600">{company.address}, {company.phone}, {company.email}</p>
        </div>
      )}

      <h3 className="text-2xl font-bold text-center mb-4">Employees List</h3>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
        <tr className="bg-gray-200">
          <th className="border p-2">Username</th>
          <th className="border p-2">Role</th>
          <th className="border p-2">Employee Type</th>
          <th className="border p-2">Office</th>
          <th className="border p-2">Office Address</th>
        </tr>
        </thead>
        <tbody>
        {employees.length > 0 ? (
          employees.map((employee) => (
            <tr key={employee.id} className="border-b">
              <td className="border p-2">{employee.user.username}</td>
              <td className="border p-2">{employee.user.role}</td>
              <td className="border p-2">{employee.employeeType}</td>
              <td className="border p-2">{employee.office.name}</td>
              <td className="border p-2">{employee.office.address}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={5} className="border p-2 text-center text-gray-500">No employees found.</td>
          </tr>
        )}
        </tbody>
      </table>
    </div>
  );
}
