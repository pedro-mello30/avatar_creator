import { useState, useEffect } from 'react';

interface BaseAvatar {
  preview_image_url: string;
  preview_video_url?: string;
  gender?: string;
}

interface RegularAvatar extends BaseAvatar {
  avatar_id: string;
  avatar_name: string;
}

interface TalkingPhotoAvatar extends BaseAvatar {
  talking_photo_id: string;
  talking_photo_name: string;
}

type Avatar = (RegularAvatar | TalkingPhotoAvatar) & {
  type: 'avatars' | 'takingphoto';
};

interface ApiResponse {
  success: boolean;
  message: string;
  avatars: {
    avatars: RegularAvatar[];
    talking_photos: TalkingPhotoAvatar[];
  };
}

interface CachedData {
  avatars: Avatar[];
  timestamp: number;
}

interface UseAvatarDataResult {
  avatars: Avatar[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const ITEMS_PER_PAGE = 30;
const API_ENDPOINT = '/api/avatars';

// In-memory cache
const cache: Record<string, CachedData> = {};

export function useAvatarData(selectedType: 'avatars' | 'takingphoto'): UseAvatarDataResult {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Avatar[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('=== Starting fetchData ===');
        console.log('Selected Type:', selectedType);
        
        setLoading(true);
        setError(null);
        
        // Check cache
        const cachedData = cache[selectedType];
        const now = Date.now();
        
        if (cachedData && (now - cachedData.timestamp) < CACHE_DURATION) {
          console.log('Using cached data for', selectedType);
          console.log('Cached data:', cachedData.avatars);
          setData(cachedData.avatars);
          setLoading(false);
          return;
        }

        // Fetch all avatars
        console.log('Making API request to:', API_ENDPOINT);
        const response = await fetch(API_ENDPOINT);
        
        if (!response.ok) {
          console.error('API Response not OK:', response.status, response.statusText);
          throw new Error(`Failed to fetch avatars: ${response.statusText}`);
        }

        const result: ApiResponse = await response.json();
        console.log('API Response:', result);

        if (!result.success) {
          console.error('API returned error:', result.message);
          throw new Error(result.message || 'Failed to fetch avatars');
        }

        let processedAvatars: Avatar[];
        
        if (selectedType === 'avatars') {
          console.log('Processing regular avatars...');
          console.log('Raw avatars data:', result.avatars.avatars);
          processedAvatars = result.avatars.avatars.map(avatar => ({
            ...avatar,
            type: 'avatars' as const
          }));
        } else {
          console.log('Processing talking photos...');
          console.log('Raw talking photos data:', result.avatars.talking_photos);
          processedAvatars = result.avatars.talking_photos.map(photo => ({
            avatar_id: photo.talking_photo_id,
            avatar_name: photo.talking_photo_name,
            preview_image_url: photo.preview_image_url,
            preview_video_url: photo.preview_video_url,
            type: 'takingphoto' as const
          }));
        }

        console.log('Processed avatars:', processedAvatars);

        // Update cache
        cache[selectedType] = {
          avatars: processedAvatars,
          timestamp: now
        };

        console.log('Updated cache for', selectedType);
        setData(processedAvatars);

      } catch (err) {
        console.error('=== Error in fetchData ===');
        console.error('Error details:', err);
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
        console.error('Final error message:', errorMessage);
        setError(errorMessage);
      } finally {
        console.log('=== Finishing fetchData ===');
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedType]);

  // Calculate paginated data
  const paginatedAvatars = data.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return {
    avatars: paginatedAvatars,
    loading,
    error,
    currentPage,
    setCurrentPage,
    itemsPerPage: ITEMS_PER_PAGE,
  };
}
