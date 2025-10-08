"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "../context/CartContext";
import { urlFor } from "../../lib/sanity";
import { trackPurchase } from "../components/MetaPixel";
import { companyInfo } from "../data";

export default function Checkout() {
  const { items: cart, clearCart, getCartTotal, isLoaded } = useCart();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Shipping Information
    name: "",
    email: "",
    phone: "",
    address: "",
    policeStation: "",
    city: "",
    postalCode: "",
    country: "Bangladesh",
    
    // Payment Information
    paymentMethod: "cod", // cod = Cash on Delivery
  })
  
  const [errors, setErrors] = useState({})
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect if cart is empty (but not if order was just successfully placed)
  useEffect(() => {
    if (cart && cart.length === 0 && !orderSuccess) {
      router.push('/cart')
    }
  }, [cart, router, orderSuccess])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required'
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!formData.policeStation.trim()) newErrors.policeStation = 'Police Station is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required'
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const generateOrderNumber = () => {
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.random().toString(36).substring(2, 5).toUpperCase()
    return `ORD-${timestamp}-${random}`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const orderNum = generateOrderNumber()
      
      // Prepare cart items for Sanity
      const cartItems = cart.map(item => {
        return {
          product: {
            _type: 'reference',
            _ref: item.id
          },
          productName: item.name,
          productSlug: item.slug,
          quantity: item.quantity,
          price: item.price,
          size: item.size || null
        };
      })
      
      // Create order document
      const orderDoc = {
        _type: 'order',
        orderNumber: orderNum,
        cart: cartItems,
        total: getCartTotal(),
        user: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          userId: null
        },
        shippingAddress: {
          street: formData.address,
          policeStation: formData.policeStation,
          city: formData.city,
          postalCode: formData.zipCode,
          country: formData.country
        },
        status: 'pending',
        paymentMethod: 'cod',
        notes: formData.notes || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      // Submit to API route
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderData: orderDoc })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create order')
      }

      const result = await response.json()
      console.log('Order API response:', result)
      
      // Clear cart and show success FIRST
      console.log('Setting order success state...')
      clearCart()
      setOrderNumber(result.orderNumber)
      setOrderSuccess(true)
      console.log('Order success state set to true')
      
      // Track Purchase event for Facebook Conversions API (non-blocking)
      setTimeout(async () => {
        try {
          await trackPurchase({
            value: getCartTotal(),
            currency: 'BDT',
            content_ids: cart.map(item => item.id),
            content_type: 'product',
            num_items: cart.reduce((total, item) => total + item.quantity, 0),
            contents: cart.map(item => ({
              id: item.id,
              quantity: item.quantity,
              item_price: item.price
            }))
          })
        } catch (trackingError) {
          console.error('Facebook tracking error (non-blocking):', trackingError)
        }
      }, 100)
      
    } catch (error) {
      console.error('Error submitting order:', error)
      alert('There was an error submitting your order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 py-4">
        <div className="w-full px-1 sm:px-2">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-48 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-12 bg-gray-300 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="h-32 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Success Modal Overlay
  const SuccessModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative p-8">
          {/* Close Button */}
          <button
            onClick={() => setOrderSuccess(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Success Content */}
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">🎉 Order Successfully Placed!</h2>
            <p className="text-lg text-gray-700 mb-4">
              <strong>Congratulations!</strong> Your order has been successfully placed.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 font-medium">
                Order Number: <span className="font-bold text-green-900">#{orderNumber}</span>
              </p>
            </div>
            <p className="text-gray-600 mb-6">
              📧 <strong>Email Confirmation:</strong> Once your order is confirmed by our team, we&apos;ll send you a detailed email confirmation with tracking information.
            </p>
            <p className="text-gray-600 mb-8">
              ⏱️ <strong>Processing Time:</strong> Your order will be processed within 24 hours and shipped soon after confirmation.
            </p>
            <div className="space-y-4">
              <Link
                href="/"
                onClick={() => setOrderSuccess(false)}
                className="inline-block px-8 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-md"
              >
                Continue Shopping
              </Link>
              <div className="mt-4">
                <Link
                  href="/cart"
                  onClick={() => setOrderSuccess(false)}
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  View Cart
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="w-full px-1 sm:px-2">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Checkout Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4">
                <div>
                  <label htmlFor="policeStation" className="block text-sm font-medium text-gray-700 mb-1">
                    P.S (Police Station) *
                  </label>
                  <input
                    type="text"
                    id="policeStation"
                    name="policeStation"
                    value={formData.policeStation}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.policeStation ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.policeStation && <p className="text-red-500 text-sm mt-1">{errors.policeStation}</p>}
                </div>
                
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>
                
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.zipCode ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                </div>
              </div>
              
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Order Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Any special instructions for your order..."
                />
              </div>
            </form>
          </div>
          
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-4">
              {cart.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex items-center space-x-3">
                  <Image
                    src={item.image && typeof item.image === 'object' ? urlFor(item.image).width(60).height(60).url() : (item.image || '/placeholder-product.jpg').replace(/,$/, '')}
                    alt={item.name}
                    width={60}
                    height={60}
                    className="rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                    {item.size && <p className="text-xs text-gray-500">Size: {item.size}</p>}
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    ৳ {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total:</span>
                <span className="text-primary">৳ {getCartTotal().toFixed(2)}</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Cash on Delivery</p>
            </div>
            
            <button
              type="submit"
              form="checkout-form"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full mt-4 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Placing Order...' : 'Place Order'}
            </button>
            
            <Link
              href="/cart"
              className="block text-center mt-4 text-sm text-gray-600 hover:text-primary transition-colors"
            >
              ← Back to Cart
            </Link>
          </div>
        </div>
      </div>
      
      {/* Success Modal */}
      {orderSuccess && <SuccessModal />}
    </div>
  )
}