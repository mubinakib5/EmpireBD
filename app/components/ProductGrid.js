import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity'

export default function ProductGrid({ products }) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 mt-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  )
}

function ProductCard({ product }) {
  const imageUrl = product.images?.[0] 
    ? urlFor(product.images[0]).width(400).height(400).fit('crop').url()
    : '/placeholder-product.jpg'

  return (
    <Link 
      href={`/product/${product.slug.current}`}
      className="group block bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
    >
      {/* Product Image */}
      <div className="aspect-square bg-gray-100 overflow-hidden relative">
        <Image
          src={imageUrl}
          alt={product.images?.[0]?.alt || product.title}
          width={400}
          height={400}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        
        {/* On Sale Badge */}
        {product.onSale && (
          <div className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg">
            On Sale
            {product.salePercentage && (
              <span className="ml-1">-{product.salePercentage}%</span>
            )}
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        {/* Brand */}
        <div className="text-sm text-gray-500 mb-1 font-medium">
          {product.brand}
        </div>
        
        {/* Product Title */}
        <h3 className="text-base font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {product.title}
        </h3>
        
        {/* Price */}
        <div className="text-lg font-semibold text-gray-900">
          {product.onSale && product.originalPrice ? (
            <div className="flex items-center gap-2">
              <span className="text-primary">৳{product.price.toLocaleString()}</span>
              <span className="text-sm text-gray-500 line-through">৳{product.originalPrice.toLocaleString()}</span>
            </div>
          ) : (
            <span>৳{product.price.toLocaleString()}</span>
          )}
        </div>
        
        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {product.tags.slice(0, 2).map((tag, index) => (
              <span 
                key={index}
                className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}