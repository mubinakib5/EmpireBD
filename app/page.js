import FeaturedGrid from "./components/FeaturedGrid";
import HeroSection from "./components/HeroSection";
import { featuredGrids } from "./data";
import { getClient, ALL_HERO_SEGMENTS_QUERY, urlFor } from "../lib/sanity";

export default async function Home() {
  const client = getClient(false);
  const heroSegments = await client.fetch(ALL_HERO_SEGMENTS_QUERY);

  // Fallback mapping for featured grids based on hero segment titles
  const getFeaturedGridByTitle = (title) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('loafer') || titleLower.includes('shoe')) {
      return { features: featuredGrids.shoes, segment: 'shoes' };
    } else if (titleLower.includes('jacket') || titleLower.includes('men')) {
      return { features: featuredGrids.men, segment: 'jackets' };
    } else if (titleLower.includes('bag') || titleLower.includes('fanny')) {
      return { features: featuredGrids.summerBags, segment: 'bags' };
    } else if (titleLower.includes('sandal') || titleLower.includes('clog')) {
      return { features: featuredGrids.sandals, segment: 'sandals' };
    }
    // Default fallback
    return { features: featuredGrids.shoes, segment: 'shoes' };
  };

  return (
    <main className="bg-white min-h-screen">
      {heroSegments.map((heroSegment, index) => {
        const featuredGrid = getFeaturedGridByTitle(heroSegment.title);
        const imageUrl = heroSegment.coverImage?.asset?.url || '';
        
        return (
          <div key={heroSegment._id}>
            <HeroSection
              image={imageUrl}
              title={heroSegment.title}
              description={heroSegment.description || ''}
              buttonText="EXPLORE"
              textColor="text-white"
              borderColor="border-white"
              showTopPadding={index === 0}
              segment={heroSegment.slug.current}
            />
            <FeaturedGrid 
              features={featuredGrid.features} 
              segment={heroSegment.slug.current} 
            />
          </div>
        );
      })}
    </main>
  );
}
