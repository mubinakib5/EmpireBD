"use client";
import ProductGallery from "./ProductGallery";
import SizeSelector from "./SizeSelector";
import AddToCart from "./AddToCart";
import ProductInfo from "./ProductInfo";
import Reviews from "./Reviews";
import RelatedProducts from "./RelatedProducts";

export default function ProductPageClient({ product, relatedProducts }) {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <a href="/" className="text-gray-500 hover:text-gray-700">
                Home
              </a>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <a
                  href={`/explore/${product.heroSegment?.slug?.current}`}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {product.heroSegment?.title}
                </a>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-900">{product.title}</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Product Details */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          {/* Image Gallery */}
          <ProductGallery images={product.images} title={product.title} />

          {/* Product Info */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {product.title}
            </h1>
            
            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <div className="flex items-center space-x-2">
                {product.onSale && product.originalPrice ? (
                  <>
                    <p className="text-3xl tracking-tight text-gray-900">
                      ৳ {product.price}
                    </p>
                    <p className="text-xl text-gray-500 line-through">
                      ৳ {product.originalPrice}
                    </p>
                    {product.salePercentage && (
                      <span className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-0.5 rounded">
                        {product.salePercentage}% OFF
                      </span>
                    )}
                  </>
                ) : (
                  <p className="text-3xl tracking-tight text-gray-900">
                    ৳ {product.price}
                  </p>
                )}
              </div>
            </div>

            {/* Brand */}
            <div className="mt-4">
              <p className="text-lg text-gray-600">{product.brand}</p>
            </div>

            {/* Summary */}
            <div className="mt-6">
              <p className="text-base text-gray-700">{product.summary}</p>
            </div>

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <SizeSelector sizes={product.sizes} />
            )}

            {/* Add to Cart */}
            <AddToCart product={product} />

            {/* Shipping Info */}
            {product.shipping?.freeShipping && (
              <div className="mt-4 flex items-center text-sm text-green-600">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Free Shipping
              </div>
            )}
          </div>
        </div>

        {/* Product Information Tabs */}
        <ProductInfo product={product} />

        {/* Reviews Section */}
        <Reviews productId={product._id} />

        {/* Related Products */}
        <RelatedProducts products={relatedProducts} />
      </div>
    </div>
  );
}