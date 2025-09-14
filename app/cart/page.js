'use client'

import { useCart } from '../context/CartContext'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { urlFor } from '@/lib/sanity'

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, getCartTotal, clearCart, isLoaded } = useCart()
  const { data: session } = useSession()
  const [isClearing, setIsClearing] = useState(false)

  const handleQuantityChange = (id, newQuantity, size) => {
    if (newQuantity < 1) {
      removeFromCart(id, size)
    } else {
      updateQuantity(id, newQuantity, size)
    }
  }

  const handleClearCart = async () => {
    setIsClearing(true)
    clearCart()
    setTimeout(() => setIsClearing(false), 500)
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-48 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gray-300 rounded"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white rounded-lg shadow-sm p-12">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven&apos;t added any items to your cart yet.</p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <button
            onClick={handleClearCart}
            disabled={isClearing}
            className="text-sm text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
          >
            {isClearing ? 'Clearing...' : 'Clear Cart'}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-200">
            {items.map((item) => (
              <div key={`${item.id}-${item.size}`} className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <Image
                      src={item.image && typeof item.image === 'object' ? urlFor(item.image).width(80).height(80).url() : item.image || '/placeholder-product.jpg'}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.slug}`}
                      className="text-lg font-medium text-gray-900 hover:text-primary transition-colors"
                    >
                      {item.name}
                    </Link>
                    {item.size && (
                      <p className="text-sm text-gray-500 mt-1">Size: {item.size}</p>
                    )}
                    <p className="text-lg font-semibold text-primary mt-2">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.size)}
                        className="p-2 hover:bg-gray-100 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="px-4 py-2 text-center min-w-[3rem]">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.size)}
                        className="p-2 hover:bg-gray-100 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.id, item.size)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      ৳ {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-gray-50 px-6 py-4">
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Total:</span>
              <span className="text-2xl text-primary">৳ {getCartTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link
            href="/"
            className="flex-1 text-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </Link>
          
          {session ? (
            <Link
              href="/checkout"
              className="flex-1 text-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              Proceed to Checkout
            </Link>
          ) : (
            <Link
              href="/auth/signin?callbackUrl=/checkout"
              className="flex-1 text-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              Sign In to Checkout
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}