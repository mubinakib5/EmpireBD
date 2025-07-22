import FeaturedGrid from "./components/FeaturedGrid";
import FeaturedGridMen from "./components/FeaturedGridMen";
import HeroSection from "./components/HeroSection";
import HeroSectionMen from "./components/HeroSectionMen";
import HeroSectionSummerBags from "./components/HeroSectionSummerBags";

export default function Home() {
  return (
    <main className="bg-white min-h-screen">
      <HeroSection />
      <FeaturedGrid />
      <HeroSectionMen />
      <FeaturedGridMen />
      <HeroSectionSummerBags />
    </main>
  );
}
