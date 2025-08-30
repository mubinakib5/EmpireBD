import { urlFor } from "@/lib/sanity";
import Image from "next/image";
import Link from "next/link";

export default function StandardHeroCard({ segment }) {
  const {
    title,
    slug,
    description,
    coverImage,
    ctaLabel = "Explore",
    badge,
  } = segment;

  return (
    <Link href={`/explore/${slug}`} className="group block">
      <div className="relative h-[36rem] md:h-[42rem] overflow-hidden bg-gray-100">
        <Image
          src={urlFor(coverImage).width(600).height(400).url()}
          alt={coverImage?.alt || title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Badge */}
        {badge && (
          <div className="absolute top-4 right-4 z-10">
            <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-white/90 text-gray-900 backdrop-blur-sm">
              {badge}
            </span>
          </div>
        )}

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="text-xl md:text-2xl font-bold mb-2 line-clamp-2">
            {title}
          </h3>

          {description && (
            <p className="text-white/90 mb-4 line-clamp-2 leading-relaxed text-sm">
              {description}
            </p>
          )}

          <div className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-900 font-semibold text-sm rounded-full transition-all duration-200 group-hover:bg-gray-100">
             <span>{ctaLabel}</span>
             <svg
               className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
               fill="none"
               stroke="currentColor"
               viewBox="0 0 24 24"
             >
               <path
                 strokeLinecap="round"
                 strokeLinejoin="round"
                 strokeWidth={2}
                 d="M17 8l4 4m0 0l-4 4m4-4H3"
               />
             </svg>
           </div>
        </div>
      </div>
    </Link>
  );
}
