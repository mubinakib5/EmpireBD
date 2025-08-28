import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'
import { client } from '@/sanity/lib/client'
import { writeClient } from '@/sanity/lib/client'

// GET - Fetch user profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch customer profile from Sanity
    const profile = await client.fetch(
      `*[_type == "customerProfile" && authUserId == $userId][0]{
        _id,
        authUserId,
        email,
        name,
        avatar,
        phone,
        dateOfBirth,
        gender,
        addresses,
        preferences,
        socialLinks,
        createdAt,
        updatedAt
      }`,
      { userId: session.user.id }
    )

    if (!profile) {
      // Return a default profile structure if none exists
      // Note: Profile creation should be handled through Sanity Studio or with proper permissions
      const defaultProfile = {
        _id: null,
        authUserId: session.user.id,
        email: session.user.email,
        name: session.user.name || '',
        avatar: session.user.image ? { _type: 'url', url: session.user.image } : null,
        phone: '',
        dateOfBirth: null,
        gender: '',
        addresses: [],
        preferences: {
          locale: 'en-US',
          currency: 'BDT',
          marketingOptIn: false,
          newsletterOptIn: false,
          productUpdatesOptIn: false
        },
        socialLinks: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        _isDefault: true // Flag to indicate this is a default profile
      }

      return NextResponse.json({ profile: defaultProfile })
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

// PATCH - Update user profile
export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, phone, dateOfBirth, gender, socialLinks } = body

    // Validate input
    if (name && (typeof name !== 'string' || name.trim().length === 0)) {
      return NextResponse.json(
        { error: 'Name must be a non-empty string' },
        { status: 400 }
      )
    }

    if (phone && (typeof phone !== 'string' || !/^\+?[1-9]\d{1,14}$/.test(phone))) {
      return NextResponse.json(
        { error: 'Phone must be in valid E.164 format' },
        { status: 400 }
      )
    }

    if (dateOfBirth && isNaN(Date.parse(dateOfBirth))) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      )
    }

    if (gender && !['male', 'female', 'other', 'prefer-not-to-say'].includes(gender)) {
      return NextResponse.json(
        { error: 'Invalid gender value' },
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
        { error: 'Profile not found. Please create a profile through Sanity Studio first.' },
        { status: 404 }
      )
    }

    // Prepare update data
    const updateData = {
      updatedAt: new Date().toISOString()
    }

    if (name !== undefined) updateData.name = name.trim()
    if (phone !== undefined) updateData.phone = phone
    if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth
    if (gender !== undefined) updateData.gender = gender
    if (socialLinks !== undefined) updateData.socialLinks = socialLinks

    // Update profile in Sanity
    const updatedProfile = await writeClient
      .patch(existingProfile._id)
      .set(updateData)
      .commit()

    return NextResponse.json({ 
      profile: updatedProfile,
      message: 'Profile updated successfully' 
    })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}