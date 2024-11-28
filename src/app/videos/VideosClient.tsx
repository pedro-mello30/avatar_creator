'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Video {
  video_id: string;
  status: 'processing' | 'completed' | 'failed';
  video_title: string;
  created_at: number;
  type: string;
  video_url?: string;
  thumbnail_url?: string;
  gif_url?: string;
  duration?: number;
  error?: string;
}

export default function VideosClient() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const router = useRouter();

  const fetchVideos = async (token?: string) => {
    try {
      const params = new URLSearchParams({
        limit: '10',
        ...(token && { token }),
      });

      const response = await fetch(`/api/videos?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        console.error('API Error:', data);
        throw new Error(data.message || 'Failed to fetch videos');
      }

      console.log('Fetched videos:', data);
      return data;
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true);
        const data = await fetchVideos();
        setVideos(data.videos);
        setNextToken(data.token);
        setHasMore(!!data.token);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch videos');
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

  const loadMore = async () => {
    if (!videos.length || !nextToken) return;

    try {
      setLoading(true);
      const data = await fetchVideos(nextToken);
      setVideos(prev => [...prev, ...data.videos]);
      setNextToken(data.token);
      setHasMore(!!data.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more videos');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoClick = (videoId: string) => {
    router.push(`/video-status/${videoId}`);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.round(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow sm:rounded-lg p-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-red-600 mb-2">Error Loading Videos</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Retry
                </button>
                <button
                  onClick={() => router.push('/create-video')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Create New Video
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
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Videos</h2>
            <p className="mt-1 text-sm text-gray-500">
              Click on a video to view its details and status
            </p>
          </div>

          <div className="border-t border-gray-200">
            {videos.length === 0 && !loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No videos found</p>
                <button
                  onClick={() => router.push('/create-video')}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Create Your First Video
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {videos.map((video, index) => {
                  return (
                    <div
                      key={`video-${video.video_id}-${index}`}
                      onClick={() => handleVideoClick(video.video_id)}
                      className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                    >
                      <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                        {video.thumbnail_url ? (
                          <img
                            src={video.thumbnail_url}
                            alt="Video thumbnail"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center">
                            <svg
                              className="h-12 w-12 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                key="video-icon-path"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              video.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : video.status === 'processing'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {video.status}
                          </span>
                          {video.duration && (
                            <span className="text-sm text-gray-500">
                              {formatDuration(video.duration)}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          Created: {formatDate(video.created_at)}
                        </div>
                        <span className="text-sm text-gray-500">
                          {video.video_title}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {loading && (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            )}

            {hasMore && videos.length > 0 && !loading && (
              <div className="flex justify-center pb-8">
                <button
                  onClick={loadMore}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Load More
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
