import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { eventName, eventData, userData } = await request.json();
    
    const accessToken = process.env.FACEBOOK_CONVERSIONS_API_TOKEN;
    const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
    
    if (!accessToken || !pixelId) {
      return NextResponse.json(
        { error: 'Missing Facebook Conversions API configuration' },
        { status: 500 }
      );
    }
    
    // Prepare the event data for Facebook Conversions API
    const eventTime = Math.floor(Date.now() / 1000);
    const eventId = `${eventName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const conversionsData = {
      data: [{
        event_name: eventName,
        event_time: eventTime,
        event_id: eventId,
        action_source: 'website',
        event_source_url: eventData.event_source_url || request.headers.get('referer'),
        user_data: {
          client_ip_address: request.headers.get('x-forwarded-for') || 
                            request.headers.get('x-real-ip') || 
                            '127.0.0.1',
          client_user_agent: request.headers.get('user-agent'),
          ...userData
        },
        custom_data: {
          ...eventData,
          currency: eventData.currency || 'BDT'
        }
      }]
    };
    
    // Send to Facebook Conversions API
    const response = await fetch(`https://graph.facebook.com/v18.0/${pixelId}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(conversionsData)
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      console.error('Facebook Conversions API Error:', result);
      return NextResponse.json(
        { error: 'Failed to send event to Facebook Conversions API', details: result },
        { status: response.status }
      );
    }
    
    return NextResponse.json({
      success: true,
      eventId: eventId,
      facebookResponse: result
    });
    
  } catch (error) {
    console.error('Conversions API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}