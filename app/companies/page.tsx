'use client';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import CompanyModal from '@/components/CompanyModal';
import DeliveryFeeModal from '@/components/DeliveryFeeModal';
import AuthContext from '@/context/AuthContext';

interface Company {
  id?: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  created: string;
  updated: string;
}

interface DeliveryFee {
  id?: number;
  companyId: number;
  weightPerKg: number;
  pricePerKgOffice: number;
  pricePerKgAddress: number;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedFee, setSelectedFee] = useState<DeliveryFee | null>(null);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const router = useRouter();
  const auth = useContext(AuthContext);

  // Protect the page and prevent unauthorized API requests
  useEffect(() => {
    if (!auth || auth.isLoading) return; // Wait until profile is loaded

    if (auth.profile?.role !== 'ADMIN' && auth.profile?.role !== 'EMPLOYEE') {
      router.push('/dashboard'); // Redirect unauthorized users
    } else {
      fetchCompanies();
    }
  }, [auth]);

  const fetchCompanies = async () => {
    try {
      const response = await api.get('/companies');
      setCompanies(response.data);
    } catch (error) {
      console.error('Failed to fetch companies', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  const handleEdit = (company: Company) => {
    setSelectedCompany(company);
    setIsCompanyModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedCompany(null);
    setIsCompanyModalOpen(true);
  };

  const handleEditFees = async (companyId: number) => {
    try {
      const response = await api.get(`/deliveryfees/${companyId}`);
      setSelectedFee(response.data);
    } catch {
      console.warn('No existing fee found, opening empty form');
      setSelectedFee({ companyId, weightPerKg: 0, pricePerKgOffice: 0, pricePerKgAddress: 0 });
    }
    setIsFeeModalOpen(true);
  };

  const handleCloseModals = async () => {
    setIsCompanyModalOpen(false);
    setIsFeeModalOpen(false);
    try {
      const response = await api.get('/companies');
      setCompanies(response.data);
    } catch (error) {
      console.error('Failed to refresh companies', error);
    }
  };

  if (auth && auth.isLoading || isLoading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-center mb-6">Company List</h2>

      <div className="flex justify-end mb-4">
        <button
          onClick={handleCreate}
          disabled={auth && auth.profile?.role !== 'ADMIN'}
          className={`px-4 py-2 rounded ${auth && auth.profile?.role === 'ADMIN' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
        >
          Add New Company
        </button>
      </div>

      <table className="w-full border-collapse border border-gray-300 text-left">
        <thead>
        <tr className="bg-gray-200">
          <th className="border p-3">Name</th>
          <th className="border p-3">Address</th>
          <th className="border p-3">Phone</th>
          <th className="border p-3">Email</th>
          <th className="border p-3 text-center">Actions</th>
        </tr>
        </thead>
        <tbody>
        {companies.map((company) => (
          <tr key={company.id} className="border-b">
            <td className="border p-3">{company.name}</td>
            <td className="border p-3">{company.address}</td>
            <td className="border p-3">{company.phone}</td>
            <td className="border p-3">{company.email}</td>
            <td className="border p-3">
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => handleEdit(company)}
                  disabled={auth && auth.profile?.role !== 'ADMIN'}
                  className={`px-3 py-1 rounded ${auth && auth.profile?.role === 'ADMIN' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleNavigate(`/companies/${company.id}/offices`)}
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                  Offices
                </button>
                <button
                  onClick={() => handleEditFees(company.id!)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded"
                >
                  Edit Delivery Fees
                </button>
                <button
                  onClick={() => handleNavigate(`/companies/${company.id}/employees`)}
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                  Employees
                </button>
                <button
                  onClick={() => handleNavigate(`/companies/${company.id}/packages`)}
                  className="px-3 py-1 bg-purple-500 text-white rounded"
                >
                  Packages
                </button>
                <button
                  onClick={() => handleNavigate(`/companies/${company.id}/revenue`)}
                  className="px-3 py-1 bg-green-600 text-white rounded"
                >
                  Revenue
                </button>
              </div>
            </td>
          </tr>
        ))}
        </tbody>
      </table>

      {isCompanyModalOpen && <CompanyModal company={selectedCompany} onClose={handleCloseModals} />}
      {isFeeModalOpen && selectedFee && <DeliveryFeeModal deliveryFee={selectedFee} onClose={handleCloseModals} />}
    </div>
  );
}
