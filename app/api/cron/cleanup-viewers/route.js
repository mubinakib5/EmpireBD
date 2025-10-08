import { NextResponse } from 'next/server';
import { previewClient } from '@/lib/sanity';

// This endpoint can be called by a cron service (like Vercel Cron or external cron)
// to automatically clean up inactive viewer sessions

export async function GET(request) {
  try {
    // Verify the request is from a trusted source (optional security measure)
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.CRON_SECRET_TOKEN;
    
    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    // Also delete very old sessions (older than 24 hours) to keep database clean
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const oldSessionsQuery = `*[_type == "productViewer" && lastSeen < $oneDayAgo]`;
    
    const oldSessions = await previewClient.fetch(oldSessionsQuery, {
      oneDayAgo
    });

    // Delete old sessions
    const deletePromises = oldSessions.map(session => 
      previewClient.delete(session._id)
    );

    await Promise.all(deletePromises);

    // Get statistics for manual cleanup
    const activeCount = await previewClient.fetch(`count(*[_type == "productViewer" && isActive == true])`);
    const pendingInactiveCount = await previewClient.fetch(`count(*[_type == "productViewer" && isActive == true && lastSeen < $fiveMinutesAgo])`, {
      fiveMinutesAgo
    });
    const totalCount = await previewClient.fetch(`count(*[_type == "productViewer"])`)

    return NextResponse.json({
      success: true,
      message: 'Cleanup completed successfully',
      inactiveSessionsMarked: inactiveSessions.length,
      oldSessionsDeleted: oldSessions.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error during automated cleanup:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Cleanup failed',
      message: error.message 
    }, { status: 500 });
  }
}

// POST method for manual cleanup (same functionality)
export async function POST(request) {
  return GET(request);
}