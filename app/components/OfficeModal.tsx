'use client';
import { useState } from 'react';
import api from '@/lib/api';

interface Office {
  id?: number; // ID is optional for new offices
  name: string;
  address: string;
  company_id: number;
}

interface ModalProps {
  office?: Office | null; // Office can be null for new ones
  companyId: number;
  onClose: () => void;
}

export default function OfficeModal({ office, companyId, onClose }: ModalProps) {
  const isEditing = !!office?.id; // Check if editing or creating
  const [formData, setFormData] = useState<Office>({
    id: office?.id,
    name: office?.name || '',
    address: office?.address || '',
    company_id: companyId, // Always set company_id
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
      if (isEditing && formData.id) {
        // Update existing office
        await api.put(`/offices/${formData.id}`, formData);
      } else {
        // Create new office
        await api.post('/offices', formData);
      }
      onClose(); // Close modal after success
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save office');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit Office' : 'New Office'}</h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input type="hidden" name="id" value={formData?.id} />
          <input
            type="text"
            name="name"
            placeholder="Office Name"
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
              {isEditing ? 'Save Changes' : 'Create Office'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
