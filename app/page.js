import FeaturedGrid from "./components/FeaturedGrid";
import HeroSection from "./components/HeroSection";
import { featuredGrids, heroSections } from "./data";

export default function Home() {
  return (
    <main className="bg-white min-h-screen">
      <HeroSection
        image={heroSections.shoes.image}
        title={heroSections.shoes.title}
        description={heroSections.shoes.description}
        buttonText={heroSections.shoes.buttonText}
        textColor={heroSections.shoes.textColor}
        borderColor={heroSections.shoes.borderColor}
        showTopPadding={true}
        segment={heroSections.shoes.segment}
      />
      <FeaturedGrid features={featuredGrids.shoes} segment="shoes" />
      <HeroSection
        image={heroSections.men.image}
        title={heroSections.men.title}
        description={heroSections.men.description}
        buttonText={heroSections.men.buttonText}
        textColor={heroSections.men.textColor}
        borderColor={heroSections.men.borderColor}
        showTopPadding={false}
        segment={heroSections.men.segment}
      />
      <FeaturedGrid features={featuredGrids.men} segment="jackets" />
      <HeroSection
        image={heroSections.summerBags.image}
        title={heroSections.summerBags.title}
        description={heroSections.summerBags.description}
        buttonText={heroSections.summerBags.buttonText}
        textColor={heroSections.summerBags.textColor}
        borderColor={heroSections.summerBags.borderColor}
        showTopPadding={false}
        segment={heroSections.summerBags.segment}
      />
      <FeaturedGrid features={featuredGrids.summerBags} segment="bags" />
      <HeroSection
        image={heroSections.sandals.image}
        title={heroSections.sandals.title}
        description={heroSections.sandals.description}
        buttonText={heroSections.sandals.buttonText}
        textColor={heroSections.sandals.textColor}
        borderColor={heroSections.sandals.borderColor}
        showTopPadding={false}
        segment={heroSections.sandals.segment}
      />
      <FeaturedGrid features={featuredGrids.sandals} segment="sandals" />
    </main>
  );
}
