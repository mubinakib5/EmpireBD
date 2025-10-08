"use client";
import { useState, useEffect, useRef } from "react";

export default function ViewerCount({ productId }) {
  const [viewerCount, setViewerCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [error, setError] = useState(null);
  const heartbeatInterval = useRef(null);
  const fetchInterval = useRef(null);

  useEffect(() => {
    if (!productId) return;

    let mounted = true;

    // Join viewing session
    const joinSession = async () => {
      try {
        const response = await fetch('/api/viewers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId }),
        });

        if (!response.ok) {
          throw new Error('Failed to join session');
        }

        const data = await response.json();
        if (mounted) {
          setSessionId(data.sessionId);
          setError(null);
        }
      } catch (err) {
        console.error('Error joining session:', err);
        if (mounted) {
          setError('Failed to join session');
        }
      }
    };

    // Fetch current viewer count
    const fetchViewerCount = async () => {
      try {
        const response = await fetch(`/api/viewers?productId=${encodeURIComponent(productId)}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch viewer count');
        }

        const data = await response.json();
        if (mounted) {
          setViewerCount(data.viewerCount);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching viewer count:', err);
        if (mounted) {
          setError('Failed to fetch viewer count');
        }
      }
    };

    // Send heartbeat to keep session alive
    const sendHeartbeat = async () => {
      if (!sessionId) return;

      try {
        const response = await fetch('/api/viewers', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId }),
        });

        if (!response.ok) {
          throw new Error('Failed to send heartbeat');
        }
      } catch (err) {
        console.error('Error sending heartbeat:', err);
      }
    };

    // Initialize
    joinSession();
    fetchViewerCount();
    
    // Show the component after a brief delay
    const showTimer = setTimeout(() => {
      if (mounted) setIsVisible(true);
    }, 1000);

    // Set up intervals
    heartbeatInterval.current = setInterval(sendHeartbeat, 30000); // Every 30 seconds
    fetchInterval.current = setInterval(fetchViewerCount, 15000); // Every 15 seconds

    return () => {
      mounted = false;
      clearTimeout(showTimer);
      
      if (heartbeatInterval.current) {
        clearInterval(heartbeatInterval.current);
      }
      
      if (fetchInterval.current) {
        clearInterval(fetchInterval.current);
      }

      // Leave session when component unmounts
      if (sessionId) {
        fetch(`/api/viewers?sessionId=${encodeURIComponent(sessionId)}`, {
          method: 'DELETE',
        }).catch(err => console.error('Error leaving session:', err));
      }
    };
  }, [productId, sessionId]);

  if (!isVisible) return null;

  // Show error state if there's an error
  if (error) {
    return (
      <div className="flex items-center space-x-2 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg px-3 py-2 mb-4 animate-fade-in">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Offline</span>
        </div>
        <span className="text-sm text-gray-600">Viewer tracking unavailable</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg px-3 py-2 mb-4 animate-fade-in">
      {/* Live indicator */}
      <div className="flex items-center space-x-1">
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
        <span className="text-xs font-medium text-primary uppercase tracking-wide">Live</span>
      </div>
      
      {/* Eye icon */}
      <svg 
        className="w-4 h-4 text-primary" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
        />
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
        />
      </svg>
      
      {/* Viewer count text */}
      <span className="text-sm font-medium text-gray-700">
        <span className="font-bold text-primary tabular-nums">{viewerCount}</span>
        {viewerCount === 1 ? ' person is' : ' people are'} viewing this product
      </span>
    </div>
  );
}