import Link from 'next/link';
import FeaturedHeroCard from './FeaturedHeroCard';
import StandardHeroCard from './StandardHeroCard';

export default function HeroGrid({ segments }) {
  // Handle edge cases
  if (!segments || segments.length === 0) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No Collections Available
          </h2>
          <p className="text-gray-600 mb-6">
            We&apos;re currently updating our collections. Please check back soon or explore our full catalog.
          </p>
          <Link
            href="/explore"
            className="inline-flex items-center px-6 py-3 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition-colors duration-200"
          >
            Browse All Products
          </Link>
        </div>
      </div>
    );
  }

  // Separate segments by priority
  const featuredSegments = segments.filter(segment => segment.priority === 'high');
  const standardSegments = segments.filter(segment => segment.priority === 'normal');

  return (
    <div className="space-y-2 sm:space-y-4">
      {/* Featured Segments (High Priority) */}
      {featuredSegments.length > 0 && (
        <div className="space-y-2 sm:space-y-4">
          {featuredSegments.map((segment) => (
            <FeaturedHeroCard key={segment._id} segment={segment} />
          ))}
        </div>
      )}
      
      {/* Standard Segments (Normal Priority) */}
      {standardSegments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
          {standardSegments.map((segment) => (
            <StandardHeroCard key={segment._id} segment={segment} />
          ))}
        </div>
      )}
      
      {/* Single segment case - center it */}
      {segments.length === 1 && (
        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            {segments[0].priority === 'high' ? (
              <FeaturedHeroCard segment={segments[0]} />
            ) : (
              <div className="max-w-md mx-auto">
                <StandardHeroCard segment={segments[0]} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}