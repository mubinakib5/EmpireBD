import HeroGrid from "./components/HeroGrid";
import { getClient, HERO_SEGMENTS_QUERY } from "../lib/sanity";

// ISR configuration
export const revalidate = 60;

export default async function Home() {
  const client = getClient(false);
  
  // Fetch hero segments with cache tags for revalidation
  const heroSegments = await client.fetch(
    HERO_SEGMENTS_QUERY,
    {},
    {
      cache: 'force-cache',
      next: {
        tags: ['heroSegments'],
        revalidate: 60
      }
    }
  );

  return (
    <main className="bg-white min-h-screen">
      <div className="w-full px-1 sm:px-2 py-2 sm:py-4">
        <HeroGrid segments={heroSegments} />
      </div>
    </main>
  );
}
