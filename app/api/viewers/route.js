import { NextResponse } from 'next/server';
import { previewClient } from '@/lib/sanity';
import { v4 as uuidv4 } from 'uuid';

// GET - Get current viewer count for a product
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Get active viewers for this product (last seen within 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    
    const query = `count(*[_type == "productViewer" && productId == $productId && lastSeen > $fiveMinutesAgo && isActive == true])`;
    
    const viewerCount = await previewClient.fetch(query, {
      productId,
      fiveMinutesAgo
    });

    return NextResponse.json({ 
      productId,
      viewerCount: viewerCount || 0,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching viewer count:', error);
    return NextResponse.json({ error: 'Failed to fetch viewer count' }, { status: 500 });
  }
}

// POST - Join viewing session
export async function POST(request) {
  try {
    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Get client info
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    const forwarded = request.headers.get('x-forwarded-for');
    const ipAddress = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'Unknown';
    
    // Generate session ID
    const sessionId = uuidv4();
    const now = new Date().toISOString();

    // Create viewer session
    const viewerSession = {
      _type: 'productViewer',
      productId,
      sessionId,
      userAgent,
      ipAddress,
      joinedAt: now,
      lastSeen: now,
      isActive: true
    };

    const result = await previewClient.create(viewerSession);

    return NextResponse.json({
      sessionId,
      productId,
      message: 'Viewer session created',
      timestamp: now
    });

  } catch (error) {
    console.error('Error creating viewer session:', error);
    return NextResponse.json({ error: 'Failed to create viewer session' }, { status: 500 });
  }
}

// PATCH - Update viewer session (heartbeat)
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const now = new Date().toISOString();

    // Update last seen timestamp
    const query = `*[_type == "productViewer" && sessionId == $sessionId][0]`;
    const viewer = await previewClient.fetch(query, { sessionId });

    if (!viewer) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    await previewClient
      .patch(viewer._id)
      .set({ 
        lastSeen: now,
        isActive: true 
      })
      .commit();

    return NextResponse.json({
      sessionId,
      message: 'Session updated',
      timestamp: now
    });

  } catch (error) {
    console.error('Error updating viewer session:', error);
    return NextResponse.json({ error: 'Failed to update viewer session' }, { status: 500 });
  }
}

// DELETE - Leave viewing session
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    // Mark session as inactive
    const query = `*[_type == "productViewer" && sessionId == $sessionId][0]`;
    const viewer = await previewClient.fetch(query, { sessionId });

    if (!viewer) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    await previewClient
      .patch(viewer._id)
      .set({ 
        isActive: false,
        lastSeen: new Date().toISOString()
      })
      .commit();

    return NextResponse.json({
      sessionId,
      message: 'Session ended',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error ending viewer session:', error);
    return NextResponse.json({ error: 'Failed to end viewer session' }, { status: 500 });
  }
}