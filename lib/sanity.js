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
  *[_type == "product" && $segment in heroSegments[]->slug.current] | order(_createdAt desc) {
    _id,
    title,
    slug,
    images,
    brand,
    price,
    summary,
    tags,
    heroSegments[]->{
      title,
      slug
    },
    navigationMenu->{
      title,
      slug
    },
    seo
  }
`;

export const PRODUCTS_BY_NAVIGATION_QUERY = `
  *[_type == "product" && navigationMenu->slug.current == $navSlug] | order(_createdAt desc) {
    _id,
    title,
    slug,
    images,
    brand,
    price,
    summary,
    tags,
    heroSegments[]->{
      title,
      slug
    },
    navigationMenu->{
      title,
      slug
    },
    seo
  }
`;

export const PRODUCTS_WITH_FILTERS_QUERY = `
  *[_type == "product" && 
    $segment in heroSegments[]->slug.current
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
    heroSegments[]->{
      title,
      slug
    },
    navigationMenu->{
      title,
      slug
    },
    seo
  }
`;

export const PRODUCTS_COUNT_QUERY = `
  count(*[_type == "product" && 
    $segment in heroSegments[]->slug.current
  ])
`;

export const PRODUCTS_COUNT_BY_NAVIGATION_QUERY = `
  count(*[_type == "product" && 
    navigationMenu->slug.current == $navSlug
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
  *[_type == "heroSegment"] | order(orderRank) {
    _id,
    title,
    "slug": slug.current,
    description,
    coverImage,
    priority,
    ctaLabel,
    badge,
    order,
    orderRank
  }
`;

export const NAVIGATION_MENUS_QUERY = `
  *[_type == "navigationMenu" && isActive == true] | order(sortOrder asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    sortOrder
  }
`;

export const NAVIGATION_MENU_QUERY = `
  *[_type == "navigationMenu" && slug.current == $navSlug][0] {
    _id,
    title,
    slug,
    description,
    seo
  }
`;

export const BRANDS_QUERY = `
  array::unique(*[_type == "product" && $segment in heroSegments[]->slug.current].brand)
`;

export const BRANDS_BY_NAVIGATION_QUERY = `
  array::unique(*[_type == "product" && navigationMenu->slug.current == $navSlug].brand)
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
