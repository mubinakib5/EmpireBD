"use client";
import { useState, useEffect, useRef } from "react";

export default function ViewerCount({ productId }) {
  // Refined fake viewer count to create urgency without real-time tracking
  const [displayedCount, setDisplayedCount] = useState(1);
  const [isVisible, setIsVisible] = useState(false);

  // Configuration (can be tuned via env)
  const jitterEnabled = (process.env.NEXT_PUBLIC_VIEWER_COUNT_JITTER_ENABLED ?? "true") !== "false";
  const jitterMinMs = Math.max(1000, parseInt(process.env.NEXT_PUBLIC_VIEWER_COUNT_JITTER_MIN_MS || "20000", 10) || 20000);
  const jitterMaxMs = Math.max(jitterMinMs, parseInt(process.env.NEXT_PUBLIC_VIEWER_COUNT_JITTER_MAX_MS || "40000", 10) || 40000);
  const upBias = Math.min(0.95, Math.max(0.05, parseFloat(process.env.NEXT_PUBLIC_VIEWER_FAKE_UP_BIAS || "0.7")));
  const minStart = Math.max(1, parseInt(process.env.NEXT_PUBLIC_VIEWER_FAKE_MIN_START || "3", 10) || 3);
  const maxStart = Math.max(minStart, parseInt(process.env.NEXT_PUBLIC_VIEWER_FAKE_MAX_START || "8", 10) || 8);
  const maxTarget = Math.max(maxStart, parseInt(process.env.NEXT_PUBLIC_VIEWER_FAKE_MAX_TARGET || "16", 10) || 16);

  const jitterTimeout = useRef(null);
  const baselineRef = useRef(1);

  useEffect(() => {
    if (!productId) return;

    let mounted = true;
    // Compute a stable per-session baseline without any API calls
    const storageKey = `viewer:baseline:${productId}`;
    const now = new Date();
    const hour = now.getHours();
    const peakBoost = (hour >= 19 && hour <= 23) ? 2 : (hour >= 11 && hour <= 14) ? 1 : 0;
    const existing = typeof window !== 'undefined' ? window.sessionStorage.getItem(storageKey) : null;
    let base = existing ? parseInt(existing, 10) : NaN;
    if (!base || Number.isNaN(base)) {
      const startMin = Math.max(1, minStart + peakBoost);
      const startMax = Math.max(startMin, maxStart + peakBoost);
      base = Math.floor(Math.random() * (startMax - startMin + 1)) + startMin;
      try {
        window.sessionStorage.setItem(storageKey, String(base));
      } catch {}
    }

    baselineRef.current = Math.min(base, maxTarget);
    setDisplayedCount(baselineRef.current);

    // Show the component after a brief delay
    const showTimer = setTimeout(() => {
      if (mounted) setIsVisible(true);
    }, 1000);

    // Jitter the displayed count, biased upward with occasional natural dips
    const scheduleJitter = () => {
      if (!jitterEnabled) return;
      const delay = Math.floor(Math.random() * (jitterMaxMs - jitterMinMs + 1)) + jitterMinMs;
      if (jitterTimeout.current) clearTimeout(jitterTimeout.current);
      jitterTimeout.current = setTimeout(() => {
        const current = typeof displayedCount === 'number' ? displayedCount : baselineRef.current || 1;
        const trendUp = Math.random() < upBias;
        const step = trendUp ? (Math.random() < 0.2 ? 2 : 1) : -1; // occasional +2 spike
        const next = Math.max(minStart, Math.min(maxTarget, current + step));
        setDisplayedCount(next);
        scheduleJitter();
      }, delay);
    };
    scheduleJitter();

    return () => {
      mounted = false;
      clearTimeout(showTimer);

      if (jitterTimeout.current) {
        clearTimeout(jitterTimeout.current);
      }
    };
  }, [productId]);

  if (!isVisible) return null;

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
        <span className="font-bold text-primary tabular-nums">{displayedCount}</span>
        {displayedCount === 1 ? ' person is' : ' people are'} viewing this product
      </span>
    </div>
  );
}