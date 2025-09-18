import { NextResponse } from 'next/server'
import { auth } from '../../../auth'
import { createClient } from 'next-sanity'

// Server-side Sanity client with write permissions
const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
})

export async function POST(request) {
  try {
    // Check if user is authenticated
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { productId, rating, text } = await request.json()

    // Validate input
    if (!productId || !rating || !text) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    if (text.length < 10) {
      return NextResponse.json(
        { error: 'Review text must be at least 10 characters' },
        { status: 400 }
      )
    }

    // Use email as userId since that's what we have in the auth config
    const userId = session.user.email || session.user.id

    // Check if user already reviewed this product
    const existingReview = await writeClient.fetch(
      `*[_type == "productReview" && product._ref == $productId && user.userId == $userId][0]`,
      {
        productId,
        userId
      }
    )

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 400 }
      )
    }

    // Create review document
    const reviewDoc = {
      _type: 'productReview',
      product: {
        _type: 'reference',
        _ref: productId
      },
      rating: parseInt(rating),
      text: text.trim(),
      user: {
        name: session.user.name || session.user.email || 'Anonymous User',
        email: session.user.email,
        userId: userId
      },
      createdAt: new Date().toISOString(),
      approved: true // Reviews are instantly approved
    }

    // Submit to Sanity
    const result = await writeClient.create(reviewDoc)

    return NextResponse.json({ 
      success: true, 
      reviewId: result._id,
      message: 'Review submitted successfully!'
    })

  } catch (error) {
    console.error('Review submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit review' },
      { status: 500 }
    )
  }
}