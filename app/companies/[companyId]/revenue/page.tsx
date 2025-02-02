'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import dayjs from 'dayjs';

export default function RevenuePage() {
  const params = useParams();
  const companyId = parseInt(params.companyId as string);

  // Tabs state
  const [activeTab, setActiveTab] = useState<'table' | 'chart'>('table');

  // Set default date range: from last month to today
  const [fromDate, setFromDate] = useState(dayjs().subtract(1, 'month').format('YYYY-MM-DD'));
  const [toDate, setToDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [revenueData, setRevenueData] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(false);

  // Fetch revenue data
  useEffect(() => {
    if (!companyId) return;

    const fetchRevenue = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/revenues/company/${companyId}/date-range/sum?from=${fromDate}&to=${toDate}`);
        setRevenueData(response.data);
      } catch (error) {
        console.error('Failed to fetch revenue data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, [companyId, fromDate, toDate]); // Refresh when company ID or dates change

  // Convert API data to chart format
  const chartData = {
    labels: Object.keys(revenueData), // Dates as labels
    datasets: [
      {
        label: 'Revenue (USD)',
        data: Object.values(revenueData), // Revenue values
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-3xl font-bold text-center mb-4">Company Revenue</h2>

      {/* Date Range Selectors */}
      <div className="flex justify-center mb-4 space-x-4">
        <div>
          <label className="block font-semibold">From:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-semibold">To:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="p-2 border rounded"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 ${activeTab === 'table' ? 'border-b-2 border-blue-500 font-bold' : 'text-gray-500'}`}
          onClick={() => setActiveTab('table')}
        >
          Table View
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'chart' ? 'border-b-2 border-blue-500 font-bold' : 'text-gray-500'}`}
          onClick={() => setActiveTab('chart')}
        >
          Chart View
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading revenue data...</p>
      ) : (
        <>
          {activeTab === 'table' ? (
            /* Table View */
            <div className="p-4 bg-white shadow-lg rounded-md">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Date</th>
                  <th className="border p-2">Revenue (USD)</th>
                </tr>
                </thead>
                <tbody>
                {Object.entries(revenueData).map(([date, revenue]) => (
                  <tr key={date} className="border-b">
                    <td className="border p-2">{date}</td>
                    <td className="border p-2">${revenue.toFixed(2)}</td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Chart View */
            <div className="p-4 bg-white shadow-lg rounded-md">
              <Line data={chartData} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
