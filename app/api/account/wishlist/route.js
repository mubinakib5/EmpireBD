import { NextResponse } from 'next/server'
import { auth } from '../../../../auth'
import { client } from '@/sanity/lib/client'
import { writeClient } from '@/sanity/lib/client'

// GET - Fetch user wishlist
export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch customer profile with wishlist and populate product details
    const profile = await client.fetch(
      `*[_type == "customerProfile" && authUserId == $userId][0]{
        wishlist[]->{
          _id,
          name,
          slug,
          price,
          discountedPrice,
          images,
          category->{
            name,
            slug
          },
          inStock,
          description
        }
      }`,
      { userId: session.user.id }
    )

    // If no profile exists, return empty wishlist array
    if (!profile) {
      return NextResponse.json({ wishlist: [] })
    }

    return NextResponse.json({ wishlist: profile.wishlist || [] })
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    )
  }
}

// POST - Add product to wishlist
export async function POST(request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { productId } = body

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Verify product exists
    const product = await client.fetch(
      `*[_type == "product" && _id == $productId][0]`,
      { productId }
    )

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Find existing profile
    const existingProfile = await client.fetch(
      `*[_type == "customerProfile" && authUserId == $userId][0]`,
      { userId: session.user.id }
    )

    if (!existingProfile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    const currentWishlist = existingProfile.wishlist || []
    
    // Check if product is already in wishlist
    const isAlreadyInWishlist = currentWishlist.some(
      item => item._ref === productId
    )

    if (isAlreadyInWishlist) {
      return NextResponse.json(
        { error: 'Product is already in wishlist' },
        { status: 400 }
      )
    }

    // Add product to wishlist
    const updatedWishlist = [
      ...currentWishlist,
      {
        _type: 'reference',
        _ref: productId,
        _key: `wishlist-${productId}-${Date.now()}`
      }
    ]

    // Update profile
    const updatedProfile = await writeClient
      .patch(existingProfile._id)
      .set({
        wishlist: updatedWishlist,
        updatedAt: new Date().toISOString()
      })
      .commit()

    // Fetch updated wishlist with product details
    const updatedWishlistWithDetails = await client.fetch(
      `*[_type == "customerProfile" && _id == $profileId][0]{
        wishlist[]->{
          _id,
          name,
          slug,
          price,
          discountedPrice,
          images,
          category->{
            name,
            slug
          },
          inStock,
          description
        }
      }`,
      { profileId: existingProfile._id }
    )

    return NextResponse.json({ 
      wishlist: updatedWishlistWithDetails.wishlist,
      message: 'Product added to wishlist successfully' 
    })
  } catch (error) {
    console.error('Error adding to wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to add product to wishlist' },
      { status: 500 }
    )
  }
}

// DELETE - Remove product from wishlist
export async function DELETE(request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Find existing profile
    const existingProfile = await client.fetch(
      `*[_type == "customerProfile" && authUserId == $userId][0]`,
      { userId: session.user.id }
    )

    if (!existingProfile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    const currentWishlist = existingProfile.wishlist || []
    
    // Check if product is in wishlist
    const productInWishlist = currentWishlist.find(
      item => item._ref === productId
    )

    if (!productInWishlist) {
      return NextResponse.json(
        { error: 'Product not found in wishlist' },
        { status: 404 }
      )
    }

    // Remove product from wishlist
    const updatedWishlist = currentWishlist.filter(
      item => item._ref !== productId
    )

    // Update profile
    const updatedProfile = await writeClient
      .patch(existingProfile._id)
      .set({
        wishlist: updatedWishlist,
        updatedAt: new Date().toISOString()
      })
      .commit()

    // Fetch updated wishlist with product details
    const updatedWishlistWithDetails = await client.fetch(
      `*[_type == "customerProfile" && _id == $profileId][0]{
        wishlist[]->{
          _id,
          name,
          slug,
          price,
          discountedPrice,
          images,
          category->{
            name,
            slug
          },
          inStock,
          description
        }
      }`,
      { profileId: existingProfile._id }
    )

    return NextResponse.json({ 
      wishlist: updatedWishlistWithDetails.wishlist || [],
      message: 'Product removed from wishlist successfully' 
    })
  } catch (error) {
    console.error('Error removing from wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to remove product from wishlist' },
      { status: 500 }
    )
  }
}