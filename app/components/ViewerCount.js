"use client";
import { useState, useEffect } from "react";

export default function ViewerCount({ productId }) {
  const [viewerCount, setViewerCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Generate initial viewer count based on product ID for consistency
    const generateInitialCount = (id) => {
      // Use product ID to create a consistent but seemingly random base count
      const hash = id.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0);
      
      // Generate a base count between 8-45 people
      const baseCount = Math.abs(hash % 38) + 8;
      return baseCount;
    };

    const initialCount = generateInitialCount(productId || 'default');
    setViewerCount(initialCount);
    
    // Show the component after a brief delay for better UX
    const showTimer = setTimeout(() => setIsVisible(true), 1000);

    // Update viewer count every 15-30 seconds with realistic fluctuations
    const updateInterval = setInterval(() => {
      setViewerCount(prevCount => {
        // Random change between -3 to +5 viewers
        const change = Math.floor(Math.random() * 9) - 3;
        const newCount = Math.max(1, prevCount + change);
        
        // Keep count within realistic bounds (1-60)
        return Math.min(60, newCount);
      });
    }, Math.random() * 15000 + 15000); // 15-30 seconds

    return () => {
      clearTimeout(showTimer);
      clearInterval(updateInterval);
    };
  }, [productId]);

  if (!isVisible) return null;

  return (
    <div className="flex items-center space-x-2 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg px-3 py-2 mb-4 animate-fade-in">
      {/* Live indicator */}
      <div className="flex items-center space-x-1">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        <span className="text-xs font-medium text-red-600 uppercase tracking-wide">Live</span>
      </div>
      
      {/* Eye icon */}
      <svg 
        className="w-4 h-4 text-red-500" 
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
        <span className="font-bold text-red-600 tabular-nums">{viewerCount}</span>
        {viewerCount === 1 ? ' person is' : ' people are'} viewing this product
      </span>
    </div>
  );
}