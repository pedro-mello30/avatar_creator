import { NextResponse } from 'next/server';

interface HeyGenVideo {
  video_id: string;
  status: 'processing' | 'completed' | 'failed';
  video_title: string;
  created_at: number;
  type: string;
}

interface HeyGenVideoListResponse {
  code: number;
  data: {
    videos: HeyGenVideo[];
    token: string;
  };
  msg: string | null;
  message: string | null;
}

export async function GET(request: Request) {
  try {
    // Check API key first
    if (!process.env.HEYGEN_API_KEY) {
      console.error('HEYGEN_API_KEY is not set in environment variables');
      return NextResponse.json(
        { message: 'API key not configured' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '10';
    const token = searchParams.get('token') || '';

    const queryParams = new URLSearchParams({
      limit,
      ...(token && { token }),
    });

    const apiUrl = `https://api.heygen.com/v1/video.list?${queryParams.toString()}`;
    console.log('Calling HeyGen API:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'x-api-key': process.env.HEYGEN_API_KEY,
      },
    });

    const data: HeyGenVideoListResponse = await response.json();
    console.log('HeyGen API Response:', data);

    if (!response.ok || data.code !== 100) {
      console.error('API request failed:', data);
      return NextResponse.json(
        { 
          message: data.message || data.msg || 'Failed to fetch videos',
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      videos: data.data.videos,
      token: data.data.token
    });
  } catch (error) {
    console.error('Error in /api/videos:', error);
    return NextResponse.json(
      { 
        message: error instanceof Error ? error.message : 'Failed to fetch videos',
        error: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
