import { notFound } from "next/navigation";
import {
  getClient,
  PRODUCTS_WITH_FILTERS_QUERY,
  PRODUCTS_BY_NAVIGATION_QUERY,
  HERO_SEGMENT_QUERY,
  NAVIGATION_MENU_QUERY,
  BRANDS_QUERY,
  BRANDS_BY_NAVIGATION_QUERY,
} from "@/lib/sanity";
import ProductGrid from "@/app/components/ProductGrid";
import ProductFilters from "@/app/components/ProductFilters";
import Pagination from "@/app/components/Pagination";

const PRODUCTS_PER_PAGE = 12;

export const revalidate = 60; // ISR revalidation

export async function generateMetadata({ params, searchParams }) {
  const client = getClient(false);
  const { segment } = await params;
  
  // Try to fetch as navigation menu first, then as hero segment
  const [navigationMenu, heroSegment] = await Promise.all([
    client.fetch(NAVIGATION_MENU_QUERY, { navSlug: segment }).catch(() => null),
    client.fetch(HERO_SEGMENT_QUERY, { segment }).catch(() => null),
  ]);

  const pageData = navigationMenu || heroSegment;
  
  if (!pageData) {
    return {
      title: "Page Not Found",
    };
  }

  return {
    title: `${pageData.title} - EmpireBD`,
    description:
      pageData.description || `Explore our ${pageData.title} collection`,
    canonical: `/explore/${segment}`,
  };
}

export default async function ExplorePage({ params, searchParams }) {
  const client = getClient(false);
  const { segment } = await params;
  const searchParamsResolved = await searchParams;
  const {
    q: search = "",
    brand = "",
    min: minPrice = "",
    max: maxPrice = "",
    sort = "newest",
    page = "1",
  } = searchParamsResolved;

  // Try to fetch as navigation menu first, then as hero segment
  const [navigationMenu, heroSegment] = await Promise.all([
    client.fetch(NAVIGATION_MENU_QUERY, { navSlug: segment }).catch(() => null),
    client.fetch(HERO_SEGMENT_QUERY, { segment }).catch(() => null),
  ]);

  const pageData = navigationMenu || heroSegment;
  const isNavigationRoute = !!navigationMenu;

  if (!pageData) {
    notFound();
  }

  // Prepare query parameters
  const offset = (parseInt(page) - 1) * PRODUCTS_PER_PAGE;
  const limit = offset + PRODUCTS_PER_PAGE;

  const queryParams = {
    [isNavigationRoute ? 'navSlug' : 'segment']: segment,
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
  const productsQuery = isNavigationRoute ? PRODUCTS_BY_NAVIGATION_QUERY : PRODUCTS_WITH_FILTERS_QUERY;
  const brandsQuery = isNavigationRoute ? BRANDS_BY_NAVIGATION_QUERY : BRANDS_QUERY;
  
  const [allProducts, brands] = await Promise.all([
    client.fetch(productsQuery, {
      [isNavigationRoute ? 'navSlug' : 'segment']: segment,
      sort,
      offset: 0,
      limit: 1000,
    }),
    client.fetch(brandsQuery, { [isNavigationRoute ? 'navSlug' : 'segment']: segment }),
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
    name: `${pageData.title} Products`,
    description: pageData.description,
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
        <div className="bg-gray-50 py-8">
          <div className="w-full px-1 sm:px-2">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {pageData.title}
              </h1>
              {pageData.description && (
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {pageData.description}
                </p>
              )}
              {isNavigationRoute && (
                <div className="mt-6">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Navigation Category
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filters and Products */}
        <div className="w-full px-1 sm:px-2 py-4">
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
