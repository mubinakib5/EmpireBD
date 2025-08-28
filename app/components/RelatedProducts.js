import Link from "next/link";

export default function RelatedProducts({ products, title = "You May Also Love" }) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 sm:mt-24">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">{title}</h2>
        <Link
          href="/explore"
          className="text-sm font-medium text-primary hover:text-gray-700"
        >
          View all
          <span aria-hidden="true"> →</span>
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {products.slice(0, 4).map((product) => (
          <div key={product._id} className="group relative">
            <Link href={`/product/${product.slug?.current}`}>
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                <img
                  src={product.images?.[0]?.asset?.url}
                  alt={product.images?.[0]?.alt || product.title}
                  className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <span aria-hidden="true" className="absolute inset-0" />
                    {product.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{product.brand}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    ৳ {product.price}
                  </p>
                  {product.onSale && product.originalPrice && (
                    <p className="text-sm text-gray-500 line-through">
                      ৳ {product.originalPrice}
                    </p>
                  )}
                </div>
              </div>
              {product.onSale && product.salePercentage && (
                <div className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                  -{product.salePercentage}%
                </div>
              )}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}