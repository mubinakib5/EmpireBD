'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { useCart } from '@/app/context/CartContext'

export default function WishlistTab({ session }) {
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid')
  const { addToCart } = useCart()

  useEffect(() => {
    fetchWishlist()
  }, [])

  const fetchWishlist = async () => {
    try {
      const response = await fetch('/api/account/wishlist')
      if (response.ok) {
        const data = await response.json()
        setWishlist(data.wishlist || [])
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error)
      toast.error('Failed to load wishlist')
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = async (productId) => {
    try {
      const response = await fetch('/api/account/wishlist', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId })
      })

      if (response.ok) {
        setWishlist(prev => prev.filter(item => item._id !== productId))
        toast.success('Removed from wishlist')
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to remove from wishlist')
      }
    } catch (error) {
      toast.error('An error occurred while removing from wishlist')
    }
  }

  const handleAddToCart = async (product) => {
    try {
      await addToCart({
        _id: product._id,
        name: product.title || product.name,
        price: product.price,
        image: product.image,
        slug: product.slug
      })
      toast.success('Added to cart!')
    } catch (error) {
      toast.error('Failed to add to cart')
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      currencyDisplay: 'symbol'
    }).format(price)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Wishlist</h2>
          <p className="text-gray-600 mt-1">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>
        
        {wishlist.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">View:</span>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${
                viewMode === 'grid'
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md ${
                viewMode === 'list'
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No items in wishlist</h3>
          <p className="mt-1 text-sm text-gray-500">Save your favorite products to view them here.</p>
          <div className="mt-6">
            <Link
              href="/products"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Browse Products
            </Link>
          </div>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
          {wishlist.map((product) => (
            viewMode === 'grid' ? (
              <div key={product._id} className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative aspect-square">
                  <Image
                    src={product.image || '/placeholder-product.jpg'}
                    alt={product.title || product.name}
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                    title="Remove from wishlist"
                  >
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                <div className="p-4">
                  <Link href={`/products/${product.slug?.current || product._id}`}>
                    <h3 className="font-medium text-gray-900 hover:text-primary transition-colors line-clamp-2">
                      {product.title || product.name}
                    </h3>
                  </Link>
                  
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 bg-primary text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
                    >
                      Add to Cart
                    </button>
                    <Link
                      href={`/products/${product.slug?.current || product._id}`}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div key={product._id} className="bg-white border rounded-lg p-4 flex items-center space-x-4">
                <div className="relative w-20 h-20 flex-shrink-0">
                  <Image
                    src={product.image || '/placeholder-product.jpg'}
                    alt={product.title || product.name}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${product.slug?.current || product._id}`}>
                    <h3 className="font-medium text-gray-900 hover:text-primary transition-colors truncate">
                      {product.title || product.name}
                    </h3>
                  </Link>
                  
                  <div className="mt-1 flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  
                  {product.description && (
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
                  >
                    Add to Cart
                  </button>
                  <Link
                    href={`/products/${product.slug?.current || product._id}`}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    className="p-2 text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                    title="Remove from wishlist"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 2a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  )
}