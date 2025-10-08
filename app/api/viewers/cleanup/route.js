import { NextResponse } from 'next/server';
import { previewClient } from '@/lib/sanity';

// POST - Cleanup inactive viewer sessions
export async function POST(request) {
  try {
    // Mark sessions as inactive if last seen more than 5 minutes ago
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    
    // Find all active sessions that haven't been seen in 5+ minutes
    const inactiveSessionsQuery = `*[_type == "productViewer" && isActive == true && lastSeen < $fiveMinutesAgo]`;
    
    const inactiveSessions = await previewClient.fetch(inactiveSessionsQuery, {
      fiveMinutesAgo
    });

    // Mark them as inactive
    const updatePromises = inactiveSessions.map(session => 
      previewClient
        .patch(session._id)
        .set({ isActive: false })
        .commit()
    );

    await Promise.all(updatePromises);

    return NextResponse.json({
      message: 'Cleanup completed',
      inactiveSessionsCount: inactiveSessions.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error during cleanup:', error);
    return NextResponse.json({ error: 'Cleanup failed' }, { status: 500 });
  }
}

// GET - Get cleanup statistics
export async function GET() {
  try {
    const now = new Date().toISOString();
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    
    const activeSessionsQuery = `count(*[_type == "productViewer" && isActive == true && lastSeen > $fiveMinutesAgo])`;
    const inactiveSessionsQuery = `count(*[_type == "productViewer" && isActive == true && lastSeen < $fiveMinutesAgo])`;
    const totalSessionsQuery = `count(*[_type == "productViewer"])`;

    const [activeSessions, pendingInactive, totalSessions] = await Promise.all([
      previewClient.fetch(activeSessionsQuery, { fiveMinutesAgo }),
      previewClient.fetch(inactiveSessionsQuery, { fiveMinutesAgo }),
      previewClient.fetch(totalSessionsQuery)
    ]);

    return NextResponse.json({
      activeSessions,
      pendingInactive,
      totalSessions,
      timestamp: now
    });

  } catch (error) {
    console.error('Error fetching cleanup stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}