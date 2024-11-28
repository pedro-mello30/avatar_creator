import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.HEYGEN_API_KEY;
    if (!apiKey) {
      console.error('HEYGEN_API_KEY not configured');
      return NextResponse.json({ 
        success: false, 
        message: 'HEYGEN_API_KEY is not configured' 
      }, { status: 500 });
    }

    console.log('Fetching avatars from HeyGen API...');
    const response = await fetch('https://api.heygen.com/v2/avatars', {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
        'content-type': 'application/json',
      },
      cache: 'no-store'
    });

    console.log('HeyGen API Response Status:', response.status);
    const responseText = await response.text();
    console.log('HeyGen API Raw Response:', responseText);

    if (!response.ok) {
      console.error('HeyGen API error:', response.status, response.statusText, responseText);
      return NextResponse.json({ 
        success: false, 
        message: `HeyGen API error: ${response.status} ${response.statusText}` 
      }, { status: response.status });
    }

    let data;
    try {
      data = JSON.parse(responseText);
      console.log('HeyGen API Parsed Data:', JSON.stringify(data, null, 2));
    } catch (e) {
      console.error('Failed to parse JSON response:', e);
      return NextResponse.json({
        success: false,
        message: 'Invalid JSON response from HeyGen API'
      }, { status: 500 });
    }

    // HeyGen API v1 response structure
    const avatars = data?.data || [];
    console.log('Processed Avatars:', JSON.stringify(avatars, null, 2));

    return NextResponse.json({
      success: true,
      avatars: avatars,
      message: 'Avatars fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching avatars:', error);
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to fetch avatars' 
    }, { status: 500 });
  }
}
