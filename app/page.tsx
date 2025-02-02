'use client';
import { useState } from 'react';
import api from '@/lib/api';

interface Package {
  id: number;
  senderId: number;
  recipientId: number;
  courierId?: number;
  deliveryType: string;
  deliveryAddress: string;
  weight: number;
  price: number;
  status: string;
  createdAt: string;
  companyId: number;
  deliveryFeeId: number;
}

export default function Home() {
  const [searchId, setSearchId] = useState('');
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!searchId.trim()) return;
    setError('');
    setPackageData(null);

    try {
      const response = await api.get(`/packages/guest/${searchId}`);
      setPackageData(response.data);
    } catch {
      setPackageData(null);
      setError('Oops! This package is lost in another dimension 🛸🚀.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-4 text-gray-800">SwiftCourier</h1>
      <p className="text-lg text-gray-600 mb-6">Seamless Shipping & Smart Tracking</p>

      {/* Search Box */}
      <div className="w-full max-w-lg">
        <div className="flex bg-white border border-gray-300 rounded-full shadow-md">
          <input
            type="text"
            placeholder="Track your package..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="w-full px-4 py-2 rounded-l-full focus:outline-none"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-blue-500 text-white rounded-r-full hover:bg-blue-600 transition"
          >
            Search
          </button>
        </div>
      </div>

      {/* Results Section */}
      <div className="mt-6 w-full max-w-xl">
        {packageData ? (
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold mb-2">Package Details 📦</h2>
            <p><strong>ID:</strong> {packageData.id}</p>
            <p><strong>Delivery Type:</strong> {packageData.deliveryType}</p>
            <p><strong>Delivery Address:</strong> {packageData.deliveryAddress}</p>
            <p><strong>Weight:</strong> {packageData.weight} kg</p>
            <p><strong>Price:</strong> ${packageData.price.toFixed(2)}</p>
            <p><strong>Status:</strong> {packageData.status}</p>
            <p><strong>Created At:</strong> {new Date(packageData.createdAt).toLocaleString()}</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-600 p-4 rounded-lg mt-4">
            {error}
          </div>
        ) : null}
      </div>
    </div>
  );
}
