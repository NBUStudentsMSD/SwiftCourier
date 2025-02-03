'use client';
import { useState, useEffect, useContext } from 'react';
import api from '@/lib/api';
import AuthContext from '@/context/AuthContext';

interface Package {
  id?: number;
  senderId: number;
  recipientId: number;
  courierId?: number;
  deliveryType: string;
  deliveryAddress: string;
  weight: number;
  price: number;
  status: string;
  companyId: number;
  deliveryFeeId: number;
}

interface Client {
  id: number;
  user: {
    id: number;
    username: string;
  };
}

interface Employee {
  id: number;
  user: {
    id: number;
    username: string;
  };
  employeeType: string;
}

interface DeliveryFee {
  id: number;
  pricePerKgAddress: number;
  pricePerKgOffice: number;
}

interface ModalProps {
  packageData?: Package | null;
  companyId: number;
  onClose: () => void;
}

export default function PackageModal({ packageData, companyId, onClose }: ModalProps) {
  const auth = useContext(AuthContext);
  const isEditing = !!packageData?.id;

  const [formData, setFormData] = useState<Package>({
    id: packageData?.id,
    senderId: packageData?.senderId || 0,
    recipientId: packageData?.recipientId || 0,
    courierId: packageData?.courierId || undefined,
    deliveryType: packageData?.deliveryType || 'ADDRESS',
    deliveryAddress: packageData?.deliveryAddress || '',
    weight: packageData?.weight || 0,
    price: packageData?.price || 0,
    status: packageData?.status || 'SENT',
    companyId,
    deliveryFeeId: packageData?.deliveryFeeId || 0,
  });

  const [clients, setClients] = useState<Client[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [, setDeliveryFees] = useState<DeliveryFee[]>([]);
  const [error, setError] = useState('');

  const employeeType = auth?.profile?.emp_type || '';

  // Fetch clients, employees, and delivery fees
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await api.get(`/clients/company/${companyId}`);
        setClients(response.data);
      } catch (err) {
        console.error('Failed to fetch clients', err);
      }
    };

    const fetchEmployees = async () => {
      try {
        const response = await api.get(`/employees/company/${companyId}`);
        setEmployees(response.data);
      } catch (err) {
        console.error('Failed to fetch employees', err);
      }
    };

    const fetchDeliveryFees = async () => {
      try {
        const response = await api.get(`/deliveryfees/${companyId}`);
        setDeliveryFees([response.data]); // API returns one fee object
      } catch (err) {
        console.error('Failed to fetch delivery fees', err);
      }
    };

    fetchClients();
    fetchEmployees();
    fetchDeliveryFees();
  }, [companyId]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isEditing) {
        await api.put(`/packages/${formData.id}`, formData);
      } else {
        await api.post('/packages', formData);
      }
      onClose(); // Close modal after success
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save package');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit Package' : 'New Package'}</h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* Sender */}
          <label className="block font-semibold">Sender</label>
          <select
            name="senderId"
            value={formData.senderId || ''}
            onChange={handleChange}
            className="w-full p-2 border mb-2"
            required
            disabled={employeeType === 'COURIER'}
          >
            <option value="">Select Sender</option>
            {clients.map(client => (
              <option key={client.id} value={client.user.id}>
                {client.user.username}
              </option>
            ))}
          </select>

          {/* Recipient */}
          <label className="block font-semibold">Recipient</label>
          <select
            name="recipientId"
            value={formData.recipientId || ''}
            onChange={handleChange}
            className="w-full p-2 border mb-2"
            required
            disabled={employeeType === 'COURIER'}
          >
            <option value="">Select Recipient</option>
            {clients.map(client => (
              <option key={client.id} value={client.user.id}>
                {client.user.username}
              </option>
            ))}
          </select>

          {/* Courier */}
          <label className="block font-semibold">Courier</label>
          <select
            name="courierId"
            value={formData.courierId || ''}
            onChange={handleChange}
            className="w-full p-2 border mb-2"
            disabled={employeeType === 'COURIER'}
          >
            <option value="">Select Courier</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.user.id}>
                {emp.user.username}
              </option>
            ))}
          </select>

          {/* Delivery Type */}
          <label className="block font-semibold">Delivery Type</label>
          <select name="deliveryType" value={formData.deliveryType} onChange={handleChange} className="w-full p-2 border mb-2" disabled={employeeType === 'COURIER'}>
            <option value="ADDRESS">Address</option>
            <option value="OFFICE">Office</option>
          </select>

          {/* Delivery Address */}
          <label className="block font-semibold">Delivery Address</label>
          <input type="text" name="deliveryAddress" value={formData.deliveryAddress} onChange={handleChange} className="w-full p-2 border mb-2" required disabled={employeeType === 'COURIER'} />

          {/* Weight */}
          <label className="block font-semibold">Weight (kg)</label>
          <input type="number" name="weight" value={formData.weight} onChange={handleChange} className="w-full p-2 border mb-2" required disabled={employeeType === 'COURIER'} />

          {/* Price */}
          <label className="block font-semibold">Price</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-2 border mb-2" required disabled={employeeType === 'COURIER'} />

          {/* Status */}
          <label className="block font-semibold">Status</label>
          <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border mb-2" disabled={employeeType === 'CASHIER' ? true : false}>
            <option value="SENT">Sent</option>
            <option value="DELIVERED">Delivered</option>
          </select>

          <div className="flex justify-end mt-4">
            <button type="button" onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded mr-2">
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded" disabled={employeeType === 'COURIER'}>
              {isEditing ? 'Save Changes' : 'Create Package'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
