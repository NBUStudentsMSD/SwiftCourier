'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import PackageModal from '@/components/PackageModal';

interface Package {
  id?: number;
  senderId: number;
  recipientId: number;
  courierId?: number;
  senderName?: string;
  recipientName?: string;
  courierName?: string;
  deliveryType: string;
  deliveryAddress: string;
  weight: number;
  price: number;
  status: string;
  createdAt: string;
  companyId: number;
  deliveryFeeId: number;
}

export default function PackagesPage() {
  const params = useParams();
  const companyId = parseInt(params.companyId as string);
  const [packages, setPackages] = useState<Package[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  // Fetch packages and usernames
  const fetchPackages = async () => {
    if (!companyId) return;
    try {
      const response = await api.get(`/packages/company/${companyId}`);
      const packagesData = response.data;

      // Fetch sender, recipient, and courier usernames
      const userIds = new Set<number>();
      packagesData.forEach((pkg: Package) => {
        userIds.add(pkg.senderId);
        userIds.add(pkg.recipientId);
        if (pkg.courierId) userIds.add(pkg.courierId);
      });

      const userRequests = Array.from(userIds).map(id => api.get(`/users/${id}`));
      const usersData = await Promise.all(userRequests);

      const userMap = usersData.reduce((map, user) => {
        map[user.data.id] = user.data.username;
        return map;
      }, {} as Record<number, string>);

      // Assign fetched usernames to packages
      const updatedPackages = packagesData.map((pkg: Package) => ({
        ...pkg,
        senderName: userMap[pkg.senderId] || 'Unknown',
        recipientName: userMap[pkg.recipientId] || 'Unknown',
        courierName: pkg.courierId ? userMap[pkg.courierId] || 'Unknown' : 'N/A',
      }));

      setPackages(updatedPackages);
    } catch (error) {
      console.error('Failed to fetch packages', error);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchPackages();
  }, [companyId]);

  // Open modal to edit a package
  const handleEdit = (pack: Package) => {
    setSelectedPackage(pack);
    setIsModalOpen(true);
  };

  // Open modal to create a new package
  const handleCreate = () => {
    setSelectedPackage(null);
    setIsModalOpen(true);
  };

  // Close modal and refresh data
  const handleModalClose = async () => {
    setIsModalOpen(false);
    setSelectedPackage(null);

    // Refresh package list **AND** refetch usernames
    await fetchPackages();
  };

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h2 className="text-3xl font-bold text-center mb-4">Packages List</h2>

      <button
        onClick={handleCreate}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
      >
        Add Package
      </button>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
        <tr className="bg-gray-200">
          <th className="border p-2">Sender</th>
          <th className="border p-2">Recipient</th>
          <th className="border p-2">Courier</th>
          <th className="border p-2">Delivery Type</th>
          <th className="border p-2">Address</th>
          <th className="border p-2">Weight (kg)</th>
          <th className="border p-2">Price</th>
          <th className="border p-2">Status</th>
          <th className="border p-2">Actions</th>
        </tr>
        </thead>
        <tbody>
        {packages.length > 0 ? (
          packages.map((pack) => (
            <tr key={pack.id} className="border-b">
              <td className="border p-2">{pack.senderName}</td>
              <td className="border p-2">{pack.recipientName}</td>
              <td className="border p-2">{pack.courierName}</td>
              <td className="border p-2">{pack.deliveryType}</td>
              <td className="border p-2">{pack.deliveryAddress}</td>
              <td className="border p-2">{pack.weight}</td>
              <td className="border p-2">${pack.price.toFixed(2)}</td>
              <td className="border p-2">{pack.status}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleEdit(pack)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={9} className="border p-2 text-center text-gray-500">
              No packages found.
            </td>
          </tr>
        )}
        </tbody>
      </table>

      {isModalOpen && (
        <PackageModal packageData={selectedPackage} companyId={companyId} onClose={handleModalClose} />
      )}
    </div>
  );
}
