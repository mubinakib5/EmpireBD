'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import StarRating from './StarRating'
import { sanityClient as client } from '../../lib/sanity'

export default function Reviews({ productId }) {
  const [reviews, setReviews] = useState([])
  const [averageRating, setAverageRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    text: ''
  })
  
  const [errors, setErrors] = useState({})

  // Fetch reviews
  useEffect(() => {
    fetchReviews()
  }, [productId])

  const fetchReviews = async () => {
    try {
      setIsLoading(true)
      const query = `
        *[_type == "productReview" && product._ref == "${productId}" && approved == true] | order(createdAt desc) {
          _id,
          rating,
          text,
          "userName": user.name,
          "userEmail": user.email,
          createdAt
        }
      `
      
      const fetchedReviews = await client.fetch(query)
      setReviews(fetchedReviews)
      setTotalReviews(fetchedReviews.length)
      
      // Calculate average rating
      if (fetchedReviews.length > 0) {
        const avg = fetchedReviews.reduce((sum, review) => sum + review.rating, 0) / fetchedReviews.length
        setAverageRating(avg)
      } else {
        setAverageRating(0)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form
    const newErrors = {}
    if (reviewForm.rating === 0) {
      newErrors.rating = 'Please select a rating'
    }
    if (reviewForm.text.length < 10) {
      newErrors.text = 'Review must be at least 10 characters long'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setIsSubmitting(true)
    setErrors({})
    
    try {
      // Submit to API endpoint
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          rating: reviewForm.rating,
          text: reviewForm.text
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit review')
      }
      
      // Reset form
      setReviewForm({ rating: 0, text: '' })
      setShowReviewForm(false)
      
      // Show success message
      alert(data.message || 'Review submitted successfully!')
      
      // Refresh reviews
      fetchReviews()
      
    } catch (error) {
      console.error('Error submitting review:', error)
      alert(error.message || 'There was an error submitting your review. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field, value) => {
    setReviewForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="mt-12">
      {/* Reviews Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h3 className="text-2xl font-bold text-gray-900">Customer Reviews</h3>
          {!isLoading && (
            <div className="flex items-center space-x-2">
              <StarRating rating={averageRating} readonly size="sm" />
              <span className="text-sm text-gray-600">({totalReviews} reviews)</span>
            </div>
          )}
        </div>
        
        {/* Reviews Dropdown Toggle */}
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <span className="text-sm font-medium">
            {isDropdownOpen ? 'Hide Reviews' : 'Show Reviews'}
          </span>
          <svg
            className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Reviews Dropdown Content */}
      {isDropdownOpen && (
        <div className="border border-gray-200 rounded-lg bg-white">
          {/* Write Review Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="text-center py-4">
              <p className="text-gray-600 mb-4">Reviews are currently disabled</p>
              <p className="text-sm text-gray-500">We&apos;re working on improving our review system</p>
            </div>
          </div>

          {/* Reviews List */}
          <div className="p-6">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="h-4 bg-gray-300 rounded w-24"></div>
                      <div className="h-4 bg-gray-300 rounded w-16"></div>
                    </div>
                    <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review._id} className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {review.userName?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{review.userName || 'Anonymous User'}</p>
                          <p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p>
                        </div>
                      </div>
                      <StarRating rating={review.rating} readonly size="sm" />
                    </div>
                    <p className="text-gray-700 leading-relaxed">{review.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}