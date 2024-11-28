import { NextResponse } from 'next/server';

const API_ENDPOINT = 'https://api.heygen.com/v2/video/generate';

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();
    console.log('Received request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch('https://api.heygen.com/v2/video/generate', {
      method: 'POST',
      headers: {
        'X-Api-Key': process.env.HEYGEN_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)  // Forward the exact request body
    });

    const responseData = await response.json();
    console.log('HeyGen API Response:', JSON.stringify(responseData, null, 2));

    if (!response.ok || responseData.error) {
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        data: responseData
      });
      return NextResponse.json(
        { 
          success: false, 
          message: responseData.error?.message || 'Failed to create video',
          error: responseData.error
        },
        { status: response.status }
      );
    }

    return NextResponse.json({ 
      success: true,
      videoId: responseData.data.video_id,
    });
  } catch (error) {
    console.error('Error in create-video route:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  }
}
