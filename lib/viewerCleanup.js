// Utility functions for viewer session cleanup

/**
 * Manually trigger cleanup of inactive viewer sessions
 * @returns {Promise<Object>} Cleanup result
 */
export async function cleanupInactiveViewers() {
  try {
    const response = await fetch('/api/viewers/cleanup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Cleanup request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error during cleanup:', error);
    throw error;
  }
}

/**
 * Get cleanup statistics
 * @returns {Promise<Object>} Cleanup statistics
 */
export async function getCleanupStats() {
  try {
    const response = await fetch('/api/viewers/cleanup');

    if (!response.ok) {
      throw new Error('Failed to fetch cleanup stats');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching cleanup stats:', error);
    throw error;
  }
}

/**
 * Schedule periodic cleanup (client-side)
 * This runs cleanup every 5 minutes while the page is active
 * @returns {Function} Cleanup function to stop the interval
 */
export function schedulePeriodicCleanup() {
  const interval = setInterval(async () => {
    try {
      await cleanupInactiveViewers();
      console.log('Periodic cleanup completed');
    } catch (error) {
      console.error('Periodic cleanup failed:', error);
    }
  }, 5 * 60 * 1000); // Every 5 minutes

  // Return cleanup function
  return () => clearInterval(interval);
}

/**
 * Initialize cleanup on page load
 * This should be called once when the application starts
 */
export function initializeCleanup() {
  // Run initial cleanup
  cleanupInactiveViewers().catch(error => {
    console.error('Initial cleanup failed:', error);
  });

  // Schedule periodic cleanup
  return schedulePeriodicCleanup();
}