import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { videoId: string } }
) {
  try {
    const response = await fetch(`https://api.heygen.com/v1/video_status/${params.videoId}`, {
      headers: {
        'X-Api-Key': process.env.HEYGEN_API_KEY!,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch video status');
    }

    // Map HeyGen status to our status format
    let status: 'pending' | 'processing' | 'completed' | 'failed';
    switch (data.data.status) {
      case 'completed':
        status = 'completed';
        break;
      case 'failed':
        status = 'failed';
        break;
      case 'processing':
        status = 'processing';
        break;
      default:
        status = 'pending';
    }

    return NextResponse.json({
      status,
      url: data.data.video_url,
      error: data.data.error
    });
  } catch (error) {
    console.error('Error fetching video status:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to fetch video status' 
      },
      { status: 500 }
    );
  }
}
