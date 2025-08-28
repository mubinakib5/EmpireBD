'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import StarRating from './StarRating'
import { sanityClient as client } from '../../lib/sanity'

export default function Reviews({ productId }) {
  const { data: session } = useSession()
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
          userName,
          userEmail,
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
    if (reviewForm.rating === 0) newErrors.rating = 'Please select a rating'
    if (!reviewForm.text.trim()) newErrors.text = 'Please write a review'
    if (reviewForm.text.trim().length < 10) newErrors.text = 'Review must be at least 10 characters long'
    
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return
    
    setIsSubmitting(true)
    
    try {
      const reviewDoc = {
        _type: 'productReview',
        product: {
          _type: 'reference',
          _ref: productId
        },
        rating: reviewForm.rating,
        text: reviewForm.text.trim(),
        userName: session.user?.name || 'Anonymous',
        userEmail: session.user?.email || '',
        userId: session.user?.id || null,
        approved: false, // Reviews need approval
        createdAt: new Date().toISOString()
      }
      
      await client.create(reviewDoc)
      
      // Reset form
      setReviewForm({ rating: 0, text: '' })
      setShowReviewForm(false)
      setErrors({})
      
      alert('Thank you for your review! It will be published after approval.')
      
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('There was an error submitting your review. Please try again.')
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
            {session ? (
              <div>
                {!showReviewForm ? (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Write a Review</span>
                  </button>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Rating *
                      </label>
                      <StarRating
                        rating={reviewForm.rating}
                        onRatingChange={(rating) => handleInputChange('rating', rating)}
                        size="lg"
                      />
                      {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="reviewText" className="block text-sm font-medium text-gray-700 mb-2">
                        Your Review *
                      </label>
                      <textarea
                        id="reviewText"
                        rows={4}
                        value={reviewForm.text}
                        onChange={(e) => handleInputChange('text', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                          errors.text ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Share your thoughts about this product..."
                      />
                      {errors.text && <p className="text-red-500 text-sm mt-1">{errors.text}</p>}
                      <p className="text-xs text-gray-500 mt-1">
                        Minimum 10 characters ({reviewForm.text.length}/10)
                      </p>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowReviewForm(false)
                          setReviewForm({ rating: 0, text: '' })
                          setErrors({})
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-600 mb-4">Please sign in to write a review</p>
                <Link
                  href="/signin"
                  className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            )}
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
                          {review.userName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{review.userName}</p>
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