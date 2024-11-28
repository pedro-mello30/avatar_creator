'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface VideoStatus {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  url?: string;
  error?: string;
}

export default function VideoStatusClient({ videoId }: { videoId: string }) {
  const [status, setStatus] = useState<VideoStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/video-status/${videoId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch video status');
        }

        setStatus(data);
        setLoading(false);

        // If still processing, check again in 5 seconds
        if (data.status === 'pending' || data.status === 'processing') {
          setTimeout(() => checkStatus(), 5000);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch video status');
        setLoading(false);
      }
    };

    checkStatus();
  }, [videoId]);

  const handleBack = () => {
    router.push('/create-video');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow sm:rounded-lg p-6">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow sm:rounded-lg p-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-red-600 mb-2">Error</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <button
                onClick={handleBack}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back to Video Creation
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Video Status</h2>
            
            {status?.status === 'completed' && status.url && (
              <div className="space-y-4">
                <div className="aspect-w-16 aspect-h-9">
                  <video 
                    src={status.url} 
                    controls 
                    className="rounded-lg shadow-lg w-full"
                  />
                </div>
                <p className="text-green-600 font-medium">Video generation completed!</p>
                <div className="space-x-4">
                  <a
                    href={status.url}
                    download
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Download Video
                  </a>
                  <button
                    onClick={handleBack}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Create Another Video
                  </button>
                </div>
              </div>
            )}

            {(status?.status === 'pending' || status?.status === 'processing') && (
              <div>
                <div className="flex justify-center mb-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
                <p className="text-gray-600">
                  {status.status === 'pending' ? 'Preparing to generate your video...' : 'Generating your video...'}
                </p>
                <p className="text-sm text-gray-500 mt-2">This may take a few minutes</p>
              </div>
            )}

            {status?.status === 'failed' && (
              <div>
                <p className="text-red-600 mb-4">
                  {status.error || 'Failed to generate video'}
                </p>
                <button
                  onClick={handleBack}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
