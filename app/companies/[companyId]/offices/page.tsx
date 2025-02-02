'use client';
import { useEffect, useState } from 'react';
//import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import OfficeModal from '@/components/OfficeModal';
import {useParams} from "next/navigation";

interface Office {
  id?: number;
  name: string;
  address: string;
  company_id: number;
}

export default function OfficesPage() {
  const params = useParams();
  const companyId = parseInt(params.companyId as string);
 // const router = useRouter();
  const [offices, setOffices] = useState<Office[]>([]);
  const [selectedOffice, setSelectedOffice] = useState<Office | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch offices from API
  useEffect(() => {
    const fetchOffices = async () => {
      try {
        const response = await api.get(`/offices/company/${companyId}`);
        setOffices(response.data);
      } catch (error) {
        console.error('Failed to fetch offices', error);
      }
    };
    fetchOffices();
  }, [companyId]);

  // Open modal with selected office data
  const handleEdit = (office: Office) => {
    setSelectedOffice(office);
    setIsModalOpen(true);
  };

  // Open modal to create a new office
  const handleCreate = () => {
    setSelectedOffice(null); // Ensure it's a new entry
    setIsModalOpen(true);
  };

  // Close modal and refresh data
  const handleModalClose = async () => {
    setIsModalOpen(false);
    setSelectedOffice(null);

    // Refresh office list after update or creation
    try {
      const response = await api.get(`/offices/company/${companyId}`);
      setOffices(response.data);
    } catch (error) {
      console.error('Failed to refresh offices', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold text-center mb-4">Office List</h2>

      <button
        onClick={handleCreate}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
      >
        Add New Office
      </button>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
        <tr className="bg-gray-200">
          <th className="border p-2">Name</th>
          <th className="border p-2">Address</th>
          <th className="border p-2">Actions</th>
        </tr>
        </thead>
        <tbody>
        {offices.map((office) => (
          <tr key={office.id} className="border-b">
            <td className="border p-2">{office.name}</td>
            <td className="border p-2">{office.address}</td>
            <td className="border p-2">
              <button
                onClick={() => handleEdit(office)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>

      {isModalOpen && (
        <OfficeModal office={selectedOffice} companyId={companyId} onClose={handleModalClose} />
      )}
    </div>
  );
}
