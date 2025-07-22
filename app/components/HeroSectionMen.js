"use client";

export default function HeroSectionMen() {
  return (
    <section className="flex justify-center items-center w-full bg-white pt-0 pb-8 px-2 md:px-4">
      <div className="relative w-full max-w-md md:max-w-2xl lg:w-[135vw] lg:max-w-7xl aspect-[3/4] lg:aspect-[1.6/1] overflow-hidden rounded-none -mt-4">
        {/* Video background */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/4.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        {/* Overlay content */}
        <div className="absolute top-0 left-0 p-4 md:p-8 lg:p-16 z-10 text-white max-w-[400px]">
          <h2 className="text-base md:text-lg lg:text-xl font-bold mb-2">
            Days of Summer
          </h2>
          <p className="text-xs md:text-sm mb-6 leading-snug opacity-90">
            Prada captures the spirit of summer in a wardrobe of essential
            purity, where elegance speaks in refined simplicity.
          </p>
          <div>
            <button className="text-xs font-semibold tracking-widest border-b-2 border-white pb-1 uppercase bg-transparent hover:opacity-80 transition">
              MEN’S EDIT
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
