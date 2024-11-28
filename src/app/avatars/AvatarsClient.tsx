'use client';

import { useState, useEffect } from 'react';
import { UserCircleIcon } from "@heroicons/react/24/outline";

interface Avatar {
  avatar_id: string;
  avatar_name: string;
  gender: string;
  preview_image_url: string;
  preview_video_url: string;
}

export default function AvatarsClient() {
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        console.log('Client: Starting to fetch avatars...');
        const response = await fetch('/api/avatars');
        console.log('Client: Response status:', response.status);
        
        const result = await response.json();
        console.log('Client: API Response:', result);

        if (!result.success) {
          throw new Error(result.message || 'Failed to fetch avatars');
        }

        if (!Array.isArray(result.avatars.avatars)) {
          console.error('Client: Invalid avatars data:', result.avatars.avatars);
          throw new Error('Invalid response format: avatars is not an array');
        }

        console.log('Client: Setting avatars:', result.avatars.avatars);
        setAvatars(result.avatars.avatars);
      } catch (err) {
        console.error('Client: Error fetching avatars:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAvatars();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-r-transparent"></div>
            <p className="mt-2 text-sm text-gray-600">Loading avatars...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-red-600">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Avatars</h1>
        
        {avatars.length === 0 ? (
          <div className="text-center py-12">
            <UserCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">No avatars available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {avatars.map((avatar) => (
              <div
                key={avatar.avatar_id}
                className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {avatar.preview_image_url ? (
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={avatar.preview_image_url}
                        alt={avatar.avatar_name}
                      />
                    ) : (
                      <UserCircleIcon className="h-10 w-10 text-gray-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">{avatar.avatar_name}</p>
                    <p className="text-sm text-gray-500">{avatar.gender}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
