'use client'; // Important: Mark as client component for hooks

import { useState, useEffect } from 'react';
import { getHealth, HealthStatus } from '@/lib/api';

export default function Home() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const data = await getHealth();
        setHealth(data);
        setLastUpdated(new Date());
        setLoading(false);
      } catch (error) {
        console.error('Error fetching health:', error);
        setLoading(false);
      }
    };


    fetchHealth();

    const interval = setInterval(fetchHealth, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">System Overview</h1>
          {lastUpdated && (
            <p className="text-sm text-gray-500 mt-2">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              System Status
            </h2>
            <div className={`text-2xl font-bold ${
              health?.status === 'ok' ? 'text-green-600' : 'text-red-600'
            }`}>
              {health?.status === 'ok' ? '✓ Healthy' : '✗ Unhealthy'}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Database
            </h2>
            <div className={`text-2xl font-bold ${
              health?.database === 'connected' ? 'text-green-600' : 'text-red-600'
            }`}>
              {health?.database === 'connected' ? '✓ Connected' : '✗ Disconnected'}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Redis
            </h2>
            <div className={`text-2xl font-bold ${
              health?.redis === 'connected' ? 'text-green-600' : 'text-red-600'
            }`}>
              {health?.redis === 'connected' ? '✓ Connected' : '✗ Disconnected'}
            </div>
          </div>
        </div>

        {health && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              System Information
            </h2>
            <div className="text-sm text-gray-600">
              <p>Timestamp: {health.timestamp}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}