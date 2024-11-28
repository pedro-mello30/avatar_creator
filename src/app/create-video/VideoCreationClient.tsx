'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface Voice {
  voice_id: string;
  name: string;
  language: string;
  gender: string;
  preview_audio?: string;
  support_pause?: boolean;
  emotion_support?: boolean;
  support_interactive_avatar?: boolean;
}

interface VideoCreationForm {
  title: string;
  text: string;
  voice_id: string;
  caption: boolean;
  dimensions: {
    width: number;
    height: number;
  };
}

const DIMENSION_PRESETS = [
  { label: 'Full HD (16:9)', width: 1920, height: 1080 },
  { label: 'HD (16:9)', width: 1280, height: 720 },
  { label: 'Square (1:1)', width: 1080, height: 1080 },
  { label: 'Mobile/Stories (9:16)', width: 1080, height: 1920 },
];

export default function VideoCreationClient({ 
  avatarId, 
  avatarType 
}: { 
  avatarId: string;
  avatarType: 'avatar' | 'takingphoto';
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [voicesLoading, setVoicesLoading] = useState(true);
  const router = useRouter();

  const [form, setForm] = useState<VideoCreationForm>({
    title: '',
    text: '',
    voice_id: '',
    caption: false,
    dimensions: DIMENSION_PRESETS[0],
  });

  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const response = await fetch('/api/voices');
        const data = await response.json();

        if (!data.success || !data.voices) {
          throw new Error(data.message || 'Failed to fetch voices');
        }

        setVoices(data.voices);
        if (data.voices.length > 0) {
          setForm(prev => ({ ...prev, voice_id: data.voices[0].voice_id }));
        }
      } catch (error) {
        console.error('Error fetching voices:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch voices');
      } finally {
        setVoicesLoading(false);
      }
    };

    fetchVoices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!avatarId) {
      setError('Avatar ID is required');
      setLoading(false);
      return;
    }

    // Create a request body that exactly matches the working example
    const requestBody = {
      video_inputs: [
        {
          character: {
            type: avatarType === 'takingphoto' ? 'talking_photo' : 'avatar',
            ...(avatarType === 'takingphoto' 
              ? {
                  talking_photo_settings: {
                    talking_photo_id: avatarId,
                    scale: 1
                  }
                }
              : {
                  avatar_id: avatarId,
                  avatar_style: 'normal',
                  scale: 1
                }
            ),
            offset: {
              x: 0.0,
              y: 0.0
            }
          },
          voice: {
            type: 'text',
            input_text: form.text,
            voice_id: form.voice_id
          }
        }
      ],
      caption: form.caption,
      dimension: {
        width: form.dimensions.width,
        height: form.dimensions.height
      }
    };

    console.log('Submitting video creation request:', JSON.stringify(requestBody, null, 2));

    try {
      const response = await fetch('/api/create-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log('Video creation response:', data);

      if (!data.success) {
        throw new Error(data.message || 'Failed to create video');
      }

      // Redirect to video status page
      router.push(`/video-status/${data.videoId}`);

    } catch (error) {
      console.error('Error creating video:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      setError(error instanceof Error ? error.message : 'Failed to create video');
    } finally {
      setLoading(false);
    }
  };

  if (!avatarId || !avatarType) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl">Invalid parameters</p>
          <p className="text-sm mt-2">Missing avatar information</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create Video</h1>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-sm rounded-lg p-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter a title for your video"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div>
            <label htmlFor="text" className="block text-sm font-medium text-gray-700">
              Script
            </label>
            <textarea
              id="text"
              name="text"
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter the script for your video..."
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
              required
            />
          </div>

          <div>
            <label htmlFor="voice" className="block text-sm font-medium text-gray-700">
              Voice
            </label>
            {voicesLoading ? (
              <div className="mt-1 text-sm text-gray-500">Loading voices...</div>
            ) : (
              <select
                id="voice"
                name="voice"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={form.voice_id}
                onChange={(e) => setForm({ ...form, voice_id: e.target.value })}
                required
              >
                <option value="">Select a voice</option>
                {voices.map((voice) => (
                  <option key={voice.voice_id} value={voice.voice_id}>
                    {voice.name} ({voice.language}, {voice.gender})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label htmlFor="dimensions" className="block text-sm font-medium text-gray-700">
              Video Dimensions
            </label>
            <select
              id="dimensions"
              name="dimensions"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={`${form.dimensions.width}x${form.dimensions.height}`}
              onChange={(e) => {
                const preset = DIMENSION_PRESETS.find(
                  d => `${d.width}x${d.height}` === e.target.value
                );
                if (preset) {
                  setForm({ ...form, dimensions: preset });
                }
              }}
            >
              {DIMENSION_PRESETS.map((preset) => (
                <option 
                  key={`${preset.width}x${preset.height}`} 
                  value={`${preset.width}x${preset.height}`}
                >
                  {preset.label} ({preset.width}x{preset.height})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="caption"
              name="caption"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={form.caption}
              onChange={(e) => setForm({ ...form, caption: e.target.checked })}
            />
            <label htmlFor="caption" className="ml-2 block text-sm text-gray-700">
              Enable captions
            </label>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || voicesLoading}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white 
                ${(loading || voicesLoading) ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Video...
                </>
              ) : (
                'Create Video'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
