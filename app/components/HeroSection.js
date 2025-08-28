"use client";

import Link from 'next/link';

export default function HeroSection({ 
  video, 
  image, 
  title, 
  description, 
  buttonText, 
  textColor = "text-white", 
  borderColor = "border-white",
  showTopPadding = true,
  segment // Add segment prop for linking to explore pages
}) {
  const sectionClasses = showTopPadding 
    ? "flex justify-center items-center w-full bg-white pt-8 pb-8 px-2 md:px-4"
    : "flex justify-center items-center w-full bg-white pt-0 pb-8 px-2 md:px-4";
  
  const containerClasses = showTopPadding
    ? "relative w-full max-w-md md:max-w-2xl lg:w-[135vw] lg:max-w-7xl aspect-[3/4] lg:aspect-[1.6/1] overflow-hidden rounded-none"
    : "relative w-full max-w-md md:max-w-2xl lg:w-[135vw] lg:max-w-7xl aspect-[3/4] lg:aspect-[1.6/1] overflow-hidden rounded-none -mt-4";

  return (
    <section className={sectionClasses}>
      <div className={containerClasses}>
        {/* Video or Image background */}
        {video ? (
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src={video}
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <img
            className="absolute inset-0 w-full h-full object-cover"
            src={image}
            alt={title}
          />
        )}
        {/* Overlay content */}
        <div className={`absolute top-0 left-0 p-4 md:p-8 lg:p-16 z-10 ${textColor} max-w-[400px]`}>
          <h2 className="text-base md:text-lg lg:text-xl font-bold mb-2">
            {title}
          </h2>
          <p className="text-xs md:text-sm mb-6 leading-snug opacity-90">
            {description}
          </p>
          <div>
            {segment ? (
              <Link 
                href={`/explore/${segment}`}
                className={`inline-block text-xs font-semibold tracking-widest border-b-2 ${borderColor} pb-1 uppercase bg-transparent hover:opacity-80 transition focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent`}
              >
                {buttonText}
              </Link>
            ) : (
              <button className={`text-xs font-semibold tracking-widest border-b-2 ${borderColor} pb-1 uppercase bg-transparent hover:opacity-80 transition`}>
                {buttonText}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
