'use client';

import { useState } from 'react';
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useAvatarData } from '@/hooks/useAvatarData';

interface Avatar {
  avatar_id: string;
  avatar_name: string;
  gender: string;
  preview_image_url: string;
  preview_video_url: string;
  type?: 'avatars' | 'takingphoto';
}

export default function AvatarsClient() {
  const [selectedType, setSelectedType] = useState<'avatars' | 'takingphoto'>('avatars');
  const {
    avatars,
    loading,
    error,
    currentPage,
    setCurrentPage,
    itemsPerPage,
  } = useAvatarData(selectedType);

  const handleTypeChange = (newType: 'avatars' | 'takingphoto') => {
    setSelectedType(newType);
    setCurrentPage(1); // Reset to first page when switching types
  };

  const handleCreateVideo = (avatar: Avatar) => {
    // Navigate to video creation page with the selected avatar
    window.location.href = `/create-video?avatar_id=${avatar.avatar_id}&type=${selectedType}`;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl">Error loading avatars</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Avatars</h1>
        
        <div className="mb-6">
          <div className="flex justify-center space-x-4 mb-4">
            <button
              className={`px-4 py-2 rounded-md transition-all ${
                selectedType === 'avatars' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => handleTypeChange('avatars')}
              disabled={loading}
            >
              {loading && selectedType === 'avatars' ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </span>
              ) : (
                'Regular Avatars'
              )}
            </button>
            <button
              className={`px-4 py-2 rounded-md transition-all ${
                selectedType === 'takingphoto' 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => handleTypeChange('takingphoto')}
              disabled={loading}
            >
              {loading && selectedType === 'takingphoto' ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </span>
              ) : (
                'Photo Avatars'
              )}
            </button>
          </div>

          {avatars.length === 0 && !loading ? (
            <div className="text-center py-12">
              <UserCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">No avatars available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {avatars.map((avatar) => (
                <div
                  key={avatar.avatar_id}
                  className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md transition-all hover:shadow-lg hover:border-blue-300"
                >
                  <div className="aspect-w-16 aspect-h-9 relative">
                    {avatar.preview_image_url ? (
                      <img
                        className="h-48 w-full object-cover"
                        src={avatar.preview_image_url}
                        alt={avatar.avatar_name}
                      />
                    ) : (
                      <div className="h-48 w-full flex items-center justify-center bg-gray-100">
                        <UserCircleIcon className="h-20 w-20 text-gray-400" />
                      </div>
                    )}
                    {avatar.preview_video_url && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button 
                          className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                          onClick={() => window.open(avatar.preview_video_url, '_blank')}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347c-.75.412-1.667-.13-1.667-.986V5.653Z" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {avatar.avatar_name}
                      </h3>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                        {avatar.gender}
                      </div>
                      <button
                        onClick={() => handleCreateVideo(avatar)}
                        className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Create Video
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {avatars.length > 0 && (
          <div className="mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1 || loading}
                className={`relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium
                  ${(currentPage === 1 || loading)
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={avatars.length < itemsPerPage || loading}
                className={`relative ml-3 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium
                  ${(avatars.length < itemsPerPage || loading)
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, avatars.length)}
                  </span> of{' '}
                  <span className="font-medium">{avatars.length}</span> results
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1 || loading}
                    className={`relative inline-flex items-center rounded-l-md px-2 py-2
                      ${(currentPage === 1 || loading)
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={avatars.length < itemsPerPage || loading}
                    className={`relative inline-flex items-center rounded-r-md px-2 py-2
                      ${(avatars.length < itemsPerPage || loading)
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
