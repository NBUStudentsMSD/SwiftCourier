'use client';
import { useState } from 'react';
import api from '@/lib/api';

interface Company {
  id?: number; // ID is optional for new companies
  name: string;
  address: string;
  phone: string;
  email: string;
}

interface ModalProps {
  company?: Company|null; // Company can be null for new ones
  onClose: () => void;
}

export default function CompanyModal({ company, onClose }: ModalProps) {
  const isEditing = !!company?.id; // Check if editing or creating
  const [formData, setFormData] = useState<Company>({
    id: company?.id,
    name: company?.name || '',
    address: company?.address || '',
    phone: company?.phone || '',
    email: company?.email || '',
  });

  const [error, setError] = useState('');

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isEditing) {
        // Update existing company
        await api.post(`/companies`, formData);
      } else {
        // Create new company
        await api.post('/companies', formData);
      }
      onClose(); // Close modal after success
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save company');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit Company' : 'New Company'}</h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input type="hidden" name="id" value={formData?.id} />
          <input
            type="text"
            name="name"
            placeholder="Company Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border mb-2"
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-2 border mb-2"
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 border mb-2"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border mb-2"
            required
          />

          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {isEditing ? 'Save Changes' : 'Create Company'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
