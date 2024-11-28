import { NextResponse } from 'next/server';

interface HeyGenVideoStatus {
  code: number;
  data: {
    callback_id: string | null;
    caption_url: string;
    created_at: number;
    duration: number;
    error: string | null;
    gif_url: string;
    id: string;
    status: 'processing' | 'completed' | 'failed';
    thumbnail_url: string;
    video_url: string;
    video_url_caption: string | null;
  };
  message: string;
}

export async function GET(
  request: Request,
  { params }: { params: { videoId: string } }
) {
  try {
    const response = await fetch(
      `https://api.heygen.com/v1/video_status.get?video_id=${params.videoId}`,
      {
        method: 'GET',
        headers: {
          'X-Api-Key': process.env.HEYGEN_API_KEY!,
          'Content-Type': 'application/json',
        },
      }
    );

    const data: HeyGenVideoStatus = await response.json();
    console.log('HeyGen Video Status Response:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch video status');
    }

    if (data.code !== 100) {
      throw new Error(data.message || 'Failed to fetch video status');
    }

    return NextResponse.json({
      video_id: data.data.id,
      status: data.data.status,
      created_at: data.data.created_at,
      duration: data.data.duration,
      error: data.data.error,
      video_url: data.data.video_url,
      thumbnail_url: data.data.thumbnail_url,
      gif_url: data.data.gif_url,
      caption_url: data.data.caption_url,
      video_url_caption: data.data.video_url_caption
    });
  } catch (error) {
    console.error('Error fetching video status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch video status' },
      { status: 500 }
    );
  }
}
