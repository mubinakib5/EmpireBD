import { urlFor } from "@/lib/sanity";
import Image from "next/image";
import Link from "next/link";

export default function FeaturedHeroCard({ segment }) {
  const {
    title,
    slug,
    description,
    coverImage,
    ctaLabel = "Explore",
    badge,
  } = segment;

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 group">
      {/* Background Image */}
      <div className="relative h-[32rem] md:h-[40rem] lg:h-[48rem]">
        <Image
          src={urlFor(coverImage).width(1920).height(1280).quality(90).url()}
          alt={coverImage?.alt || title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Badge */}
        {badge && (
          <div className="absolute top-6 left-6 z-10">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-900 backdrop-blur-sm">
              {badge}
            </span>
          </div>
        )}

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 lg:p-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              {title}
            </h2>

            {description && (
              <p className="text-lg md:text-xl text-white/90 mb-6 leading-relaxed line-clamp-3">
                {description}
              </p>
            )}

            <Link
              href={`/explore/${slug}`}
              className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 group/btn"
            >
              <span>{ctaLabel}</span>
              <svg
                className="ml-2 w-5 h-5 transition-transform duration-200 group-hover/btn:translate-x-1"
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
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
