"use client";
import { useEffect } from "react";
import Link from "next/link";
import ProductGallery from "./ProductGallery";
import SizeSelector from "./SizeSelector";
import AddToCart from "./AddToCart";
import ProductInfo from "./ProductInfo";
import Reviews from "./Reviews";
import RelatedProducts from "./RelatedProducts";
import { useMetaPixel } from "../context/MetaPixelContext";

export default function ProductPageClient({ product, relatedProducts }) {
  const { trackViewContent } = useMetaPixel();

  useEffect(() => {
    if (product) {
      trackViewContent({
        content_ids: [product._id],
        content_type: 'product',
        value: product.price,
        currency: 'BDT',
        content_name: product.title,
        content_category: product.category?.title,
      });
    }
  }, [product, trackViewContent]);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" itemScope itemType="https://schema.org/Product">
      {/* Breadcrumbs */}
      <nav className="flex mb-8" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
              Home
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <Link href="/products" className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2">
                Products
              </Link>
            </div>
          </li>
          {product.category && (
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">{product.category.title}</span>
              </div>
            </li>
          )}
          <li aria-current="page">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2" itemProp="name">{product.title}</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
        {/* Image gallery */}
        <div className="flex flex-col-reverse">
          <ProductGallery images={product.images} />
        </div>

        {/* Product info */}
        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900" itemProp="name">
            {product.title}
          </h1>

          <div className="mt-3">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl text-gray-900" itemProp="offers" itemScope itemType="https://schema.org/Offer">
              <span itemProp="price" content={product.price}>৳{product.price}</span>
              <meta itemProp="priceCurrency" content="BDT" />
              <meta itemProp="availability" content={product.outOfStock ? "https://schema.org/OutOfStock" : "https://schema.org/InStock"} />
            </p>
          </div>

          {/* Brand */}
          {product.brand && (
            <div className="mt-4" itemProp="brand" itemScope itemType="https://schema.org/Brand">
              <p className="text-sm text-gray-600">
                Brand: <span className="font-medium" itemProp="name">{product.brand}</span>
              </p>
            </div>
          )}

          {/* Description */}
          <div className="mt-6">
            <p className="text-base text-gray-700" itemProp="description">{product.summary}</p>
          </div>

          {/* Hidden microdata for required fields */}
          <div style={{ display: 'none' }}>
            <span itemProp="sku">{product._id}</span>
            <span itemProp="mpn">{product._id}</span>
            {product.images?.[0]?.asset?.url && (
              <img itemProp="image" src={product.images[0].asset.url} alt={product.title} />
            )}
          </div>

          {/* Size Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <SizeSelector sizes={product.sizes} />
          )}

          {/* Add to Cart */}
          <AddToCart product={product} />
        </div>
      </div>

      {/* Product Information Tabs */}
      <ProductInfo product={product} />

      {/* Reviews Section */}
      <Reviews productId={product._id} />

      {/* Related Products */}
      <RelatedProducts products={relatedProducts} />
    </div>
  );
}