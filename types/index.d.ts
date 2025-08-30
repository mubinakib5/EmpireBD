/**
 * TypeScript type definitions for EmpireBD project
 */

// Hero Segment Types
export interface HeroSegment {
  _id: string;
  _type: "heroSegment";
  title: string;
  slug: string;
  description?: string;
  coverImage: {
    asset: {
      _ref: string;
      _type: "reference";
    };
    hotspot?: {
      x: number;
      y: number;
      height: number;
      width: number;
    };
    crop?: {
      top: number;
      bottom: number;
      left: number;
      right: number;
    };
  };
  priority: "high" | "normal";
  ctaLabel?: string;
  badge?: string;
  _createdAt: string;
  _updatedAt: string;
}

// Sanity Image URL Builder Types
export interface SanityImageSource {
  asset: {
    _ref: string;
    _type: "reference";
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

// Component Props Types
export interface FeaturedHeroCardProps {
  segment: HeroSegment;
}

export interface StandardHeroCardProps {
  segment: HeroSegment;
}

export interface HeroGridProps {
  segments: HeroSegment[];
}

// API Response Types
export interface RevalidateRequest {
  secret: string;
  tags?: string[];
  path?: string;
}

export interface RevalidateResponse {
  revalidated: boolean;
  message?: string;
  error?: string;
}