'use client';
import { useState } from 'react';
import api from '@/lib/api';

interface DeliveryFee {
  id?: number;
  companyId: number;
  weightPerKg: number;
  pricePerKgOffice: number;
  pricePerKgAddress: number;
}

interface ModalProps {
  deliveryFee: DeliveryFee;
  onClose: () => void;
}

export default function DeliveryFeeModal({ deliveryFee, onClose }: ModalProps) {
  const isEditing = !!deliveryFee.id;
  const [formData, setFormData] = useState<DeliveryFee>(deliveryFee);
  const [error, setError] = useState('');

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Create or update delivery fee
      await api.post('/deliveryfees', formData);
      onClose(); // Close modal after success
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save delivery fee');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit Delivery Fee' : 'New Delivery Fee'}</h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="number"
            name="weightPerKg"
            placeholder="Price Per Kg"
            value={formData.weightPerKg}
            onChange={handleChange}
            className="w-full p-2 border mb-2"
            required
          />
          <input
            type="number"
            name="pricePerKgOffice"
            placeholder="Price Per Kg (Office)"
            value={formData.pricePerKgOffice}
            onChange={handleChange}
            className="w-full p-2 border mb-2"
            required
          />
          <input
            type="number"
            name="pricePerKgAddress"
            placeholder="Price Per Kg (Address)"
            value={formData.pricePerKgAddress}
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
              {isEditing ? 'Save Changes' : 'Create Fee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
