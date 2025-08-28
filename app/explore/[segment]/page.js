import { notFound } from "next/navigation";
import {
  getClient,
  PRODUCTS_WITH_FILTERS_QUERY,
  HERO_SEGMENT_QUERY,
  BRANDS_QUERY,
} from "@/lib/sanity";
import ProductGrid from "@/app/components/ProductGrid";
import ProductFilters from "@/app/components/ProductFilters";
import Pagination from "@/app/components/Pagination";

const PRODUCTS_PER_PAGE = 12;

export const revalidate = 60; // ISR revalidation

export async function generateMetadata({ params, searchParams }) {
  const client = getClient(false);
  const heroSegment = await client.fetch(HERO_SEGMENT_QUERY, {
    segment: params.segment,
  });

  if (!heroSegment) {
    return {
      title: "Page Not Found",
    };
  }

  return {
    title: `${heroSegment.title} - EmpireBD`,
    description:
      heroSegment.description || `Explore our ${heroSegment.title} collection`,
    canonical: `/explore/${params.segment}`,
  };
}

export default async function ExplorePage({ params, searchParams }) {
  const client = getClient(false);
  const { segment } = params;
  const {
    q: search = "",
    brand = "",
    min: minPrice = "",
    max: maxPrice = "",
    sort = "newest",
    page = "1",
  } = searchParams;

  // Fetch hero segment data
  const heroSegment = await client.fetch(HERO_SEGMENT_QUERY, { segment });

  if (!heroSegment) {
    notFound();
  }

  // Prepare query parameters
  const offset = (parseInt(page) - 1) * PRODUCTS_PER_PAGE;
  const limit = offset + PRODUCTS_PER_PAGE;

  const queryParams = {
    segment,
    sort,
    offset,
    limit,
  };

  // Only add optional parameters if they have values
  if (search) queryParams.search = `*${search}*`;
  if (brand) queryParams.brand = `*${brand}*`;
  if (minPrice) queryParams.minPrice = parseInt(minPrice);
  if (maxPrice) queryParams.maxPrice = parseInt(maxPrice);

  // Fetch all products for the segment
  const [allProducts, brands] = await Promise.all([
    client.fetch(PRODUCTS_WITH_FILTERS_QUERY, {
      segment,
      sort,
      offset: 0,
      limit: 1000,
    }),
    client.fetch(BRANDS_QUERY, { segment }),
  ]);

  // Apply filters in JavaScript
  let filteredProducts = allProducts;

  if (search) {
    const searchLower = search.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.title?.toLowerCase().includes(searchLower) ||
        product.brand?.toLowerCase().includes(searchLower) ||
        product.summary?.toLowerCase().includes(searchLower)
    );
  }

  if (brand) {
    const brandLower = brand.toLowerCase();
    filteredProducts = filteredProducts.filter((product) =>
      product.brand?.toLowerCase().includes(brandLower)
    );
  }

  if (minPrice) {
    filteredProducts = filteredProducts.filter(
      (product) => product.price >= parseInt(minPrice)
    );
  }

  if (maxPrice) {
    filteredProducts = filteredProducts.filter(
      (product) => product.price <= parseInt(maxPrice)
    );
  }

  // Apply sorting
  if (sort === "price_asc") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sort === "price_desc") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else {
    // Default: newest first
    filteredProducts.sort(
      (a, b) => new Date(b._createdAt) - new Date(a._createdAt)
    );
  }

  const totalProducts = filteredProducts.length;
  const products = filteredProducts.slice(offset, offset + PRODUCTS_PER_PAGE);

  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
  const currentPage = parseInt(page);

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${heroSegment.title} Products`,
    description: heroSegment.description,
    numberOfItems: totalProducts,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: offset + index + 1,
      item: {
        "@type": "Product",
        name: product.title,
        brand: product.brand,
        description: product.summary,
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "BDT",
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {heroSegment.title}
              </h1>
              {heroSegment.description && (
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {heroSegment.description}
                </p>
              )}
              <div className="mt-6 text-sm text-gray-500">
                {totalProducts} {totalProducts === 1 ? "product" : "products"}{" "}
                found
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Products */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ProductFilters
            brands={brands}
            currentFilters={{
              search,
              brand,
              minPrice,
              maxPrice,
              sort,
            }}
            segment={segment}
          />

          <ProductGrid products={products} />

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              segment={segment}
              searchParams={searchParams}
            />
          )}
        </div>
      </div>
    </>
  );
}
