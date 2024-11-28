import { NextResponse } from 'next/server';

const API_ENDPOINT = 'https://api.heygen.com/v2/voices';

export async function GET() {
  try {
    // Validate API key
    if (!process.env.HEYGEN_API_KEY) {
      console.error('Missing HEYGEN_API_KEY in environment variables');
      return NextResponse.json(
        { success: false, message: 'Server configuration error: Missing API key' },
        { status: 500 }
      );
    }

    const response = await fetch(API_ENDPOINT, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'x-api-key': process.env.HEYGEN_API_KEY,
      },
    });

    const responseData = await response.json();

    if (!response.ok || responseData.error) {
      console.error('Failed to fetch voices:', responseData);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch voices', error: responseData.error },
        { status: response.status }
      );
    }

    return NextResponse.json({ 
      success: true,
      voices: responseData.data.voices 
    });
  } catch (error) {
    console.error('Error fetching voices:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to fetch voices' 
      },
      { status: 500 }
    );
  }
}
