'use client';
import { useContext, useEffect, useState } from 'react';
import api from '@/lib/api';
import AuthContext from '@/context/AuthContext';
import {useRouter} from "next/navigation";

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

export default function DashboardPage() {
  const auth = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState<'recipient' | 'sender'>('recipient');
  const [recipientPackages, setRecipientPackages] = useState<Package[]>([]);
  const [senderPackages, setSenderPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!auth?.isLoading && !auth?.user) {
      router.push('/');
    }
  }, [auth?.isLoading, auth?.user]);

  useEffect(() => {
    if (auth && auth.profile?.role === 'CLIENT') {
      fetchRecipientPackages();
      fetchSenderPackages();
    }
  }, [auth?.profile]);

  const fetchRecipientPackages = async () => {
    if (auth && !auth.profile) return;
    setLoading(true);
    try {
      if (!auth || !auth.profile) return;
      const response = await api.get(`/packages/recipient/${auth.profile.user_id}`);
      setRecipientPackages(response.data);
    } catch (error) {
      console.error('Failed to fetch recipient packages', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSenderPackages = async () => {
    if (auth && !auth.profile) return;
    setLoading(true);
    try {
      if (!auth || !auth.profile) return;
      const response = await api.get(`/packages/sender/${auth.profile.user_id}`);
      setSenderPackages(response.data);
    } catch (error) {
      console.error('Failed to fetch sender packages', error);
    } finally {
      setLoading(false);
    }
  };

  if (auth && auth.isLoading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (!auth || !auth.profile) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-center mb-6">Dashboard</h2>

      {auth && auth.profile?.role === 'CLIENT' ? (
        <>
          {/* Tabs Navigation */}
          <div className="flex border-b mb-4">
            <button
              className={`px-4 py-2 ${activeTab === 'recipient' ? 'border-b-2 border-blue-500 font-bold' : 'text-gray-500'}`}
              onClick={() => setActiveTab('recipient')}
            >
              Packages Received
            </button>
            <button
              className={`px-4 py-2 ${activeTab === 'sender' ? 'border-b-2 border-blue-500 font-bold' : 'text-gray-500'}`}
              onClick={() => setActiveTab('sender')}
            >
              Packages Sent
            </button>
          </div>

          {/* First Tab: Packages where user is the recipient */}
          {activeTab === 'recipient' && (
            <div className="p-4 bg-gray-100 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Packages Received</h3>
              {loading ? (
                <p className="text-gray-500">Loading packages...</p>
              ) : recipientPackages.length === 0 ? (
                <p className="text-gray-500">No packages found.</p>
              ) : (
                <table className="w-full border-collapse border border-gray-300 mt-2">
                  <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">ID</th>

                    <th className="border p-2">Delivery Address</th>
                    <th className="border p-2">Status</th>
                    <th className="border p-2">Weight (kg)</th>
                    <th className="border p-2">Price</th>
                  </tr>
                  </thead>
                  <tbody>
                  {recipientPackages.map((pkg) => (
                    <tr key={pkg.id} className="border-b">
                      <td className="border p-2">{pkg.id}</td>

                      <td className="border p-2">{pkg.deliveryAddress}</td>
                      <td className="border p-2">{pkg.status}</td>
                      <td className="border p-2">{pkg.weight}</td>
                      <td className="border p-2">${pkg.price.toFixed(2)}</td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Second Tab: Packages where user is the sender */}
          {activeTab === 'sender' && (
            <div className="p-4 bg-gray-100 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Packages Sent</h3>
              {loading ? (
                <p className="text-gray-500">Loading packages...</p>
              ) : senderPackages.length === 0 ? (
                <p className="text-gray-500">No packages found.</p>
              ) : (
                <table className="w-full border-collapse border border-gray-300 mt-2">
                  <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">ID</th>

                    <th className="border p-2">Delivery Address</th>
                    <th className="border p-2">Status</th>
                    <th className="border p-2">Weight (kg)</th>
                    <th className="border p-2">Price</th>
                  </tr>
                  </thead>
                  <tbody>
                  {senderPackages.map((pkg) => (
                    <tr key={pkg.id} className="border-b">
                      <td className="border p-2">{pkg.id}</td>

                      <td className="border p-2">{pkg.deliveryAddress}</td>
                      <td className="border p-2">{pkg.status}</td>
                      <td className="border p-2">{pkg.weight}</td>
                      <td className="border p-2">${pkg.price.toFixed(2)}</td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-gray-600">Welcome to your dashboard!</p>
      )}
    </div>
  );
}
