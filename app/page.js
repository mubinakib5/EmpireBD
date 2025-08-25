import FeaturedGrid from "./components/FeaturedGrid";
import HeroSection from "./components/HeroSection";
import { heroSections, featuredGrids } from "./data";

export default function Home() {
  return (
    <main className="bg-white min-h-screen">
      <HeroSection 
        image={heroSections.women.image}
        title={heroSections.women.title}
        description={heroSections.women.description}
        buttonText={heroSections.women.buttonText}
        textColor={heroSections.women.textColor}
        borderColor={heroSections.women.borderColor}
        showTopPadding={true}
      />
      <FeaturedGrid features={featuredGrids.women} />
      <HeroSection 
        image={heroSections.men.image}
        title={heroSections.men.title}
        description={heroSections.men.description}
        buttonText={heroSections.men.buttonText}
        textColor={heroSections.men.textColor}
        borderColor={heroSections.men.borderColor}
        showTopPadding={false}
      />
      <FeaturedGrid features={featuredGrids.men} />
      <HeroSection 
        image={heroSections.summerBags.image}
        title={heroSections.summerBags.title}
        description={heroSections.summerBags.description}
        buttonText={heroSections.summerBags.buttonText}
        textColor={heroSections.summerBags.textColor}
        borderColor={heroSections.summerBags.borderColor}
        showTopPadding={false}
      />
      <FeaturedGrid features={featuredGrids.summerBags} />
      <HeroSection 
        image={heroSections.sandals.image}
        title={heroSections.sandals.title}
        description={heroSections.sandals.description}
        buttonText={heroSections.sandals.buttonText}
        textColor={heroSections.sandals.textColor}
        borderColor={heroSections.sandals.borderColor}
        showTopPadding={false}
      />
      <FeaturedGrid features={featuredGrids.sandals} />
    </main>
  );
}
