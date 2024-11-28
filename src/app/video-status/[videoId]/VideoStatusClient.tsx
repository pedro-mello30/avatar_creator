'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Props {
  videoId: string;
}

interface VideoStatus {
  video_id: string;
  status: 'processing' | 'completed' | 'failed';
  video_title: string;
  created_at: number;
  type: string;
  video_url?: string;
  thumbnail_url?: string;
  gif_url?: string;
  error?: string;
}

export default function VideoStatusClient({ videoId }: Props) {
  const [status, setStatus] = useState<VideoStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!videoId) {
      setError('No video ID provided');
      setLoading(false);
      return;
    }

    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/video-status/${videoId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch video status');
        }

        setStatus(data);

        // If still processing, poll again in 5 seconds
        if (data.status === 'processing') {
          setTimeout(checkStatus, 5000);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch video status');
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, [videoId]);

  const handleBackClick = () => {
    router.push('/videos');
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow sm:rounded-lg p-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-red-600 mb-2">Error</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Retry
                </button>
                <button
                  onClick={handleBackClick}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Back to Videos
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Video Status</h2>
              {status && (
                <p className="mt-1 text-sm text-gray-500">
                  {status.video_title}
                </p>
              )}
            </div>
            <button
              onClick={handleBackClick}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Videos
            </button>
          </div>

          <div className="border-t border-gray-200">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : status ? (
              <div className="p-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          status.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : status.status === 'processing'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {status.status}
                      </span>
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500">Created At</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {formatDate(status.created_at)}
                    </dd>
                  </div>

                  {status.video_url && (
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">Video</dt>
                      <dd className="mt-1">
                        <video
                          controls
                          className="w-full rounded-lg shadow-sm"
                          src={status.video_url}
                        />
                      </dd>
                    </div>
                  )}

                  {status.thumbnail_url && (
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">Thumbnail</dt>
                      <dd className="mt-1">
                        <img
                          src={status.thumbnail_url}
                          alt="Video thumbnail"
                          className="w-full rounded-lg shadow-sm"
                        />
                      </dd>
                    </div>
                  )}

                  {status.error && (
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-red-500">Error</dt>
                      <dd className="mt-1 text-sm text-red-700">{status.error}</dd>
                    </div>
                  )}
                </dl>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No status information available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
