import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

export const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  apiVersion: "2023-05-03",
  useCdn: process.env.NODE_ENV === "production",
};

export const sanityClient = createClient(config);

export const previewClient = createClient({
  ...config,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

export const getClient = (usePreview) =>
  usePreview ? previewClient : sanityClient;

const builder = imageUrlBuilder(sanityClient);

export const urlFor = (source) => builder.image(source);

// GROQ queries
export const PRODUCTS_QUERY = `
  *[_type == "product" && heroSegment->slug.current == $segment] | order(_createdAt desc) {
    _id,
    title,
    slug,
    images,
    brand,
    price,
    summary,
    tags,
    heroSegment->{
      title,
      slug
    },
    seo
  }
`;

export const PRODUCTS_WITH_FILTERS_QUERY = `
  *[_type == "product" && 
    heroSegment->slug.current == $segment
  ] | order(_createdAt desc) [$offset...$limit] {
    _id,
    title,
    slug,
    images,
    brand,
    price,
    originalPrice,
    onSale,
    salePercentage,
    summary,
    tags,
    heroSegment->{
      title,
      slug
    },
    seo
  }
`;

export const PRODUCTS_COUNT_QUERY = `
  count(*[_type == "product" && 
    heroSegment->slug.current == $segment
  ])
`;

export const HERO_SEGMENT_QUERY = `
  *[_type == "heroSegment" && slug.current == $segment][0] {
    _id,
    title,
    slug,
    description,
    coverImage
  }
`;

export const HERO_SEGMENTS_QUERY = `
  *[_type == "heroSegment"] | order(priority desc, _createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    description,
    coverImage,
    priority,
    ctaLabel,
    badge
  }
`;

export const BRANDS_QUERY = `
  array::unique(*[_type == "product" && heroSegment->slug.current == $segment].brand)
`;

export const ALL_HERO_SEGMENTS_QUERY = `
  *[_type == "heroSegment"] | order(_createdAt asc) {
    _id,
    title,
    slug,
    description,
    coverImage {
      asset-> {
        _id,
        url
      },
      alt
    }
  }
`;
