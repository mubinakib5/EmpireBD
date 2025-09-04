import { NextResponse } from 'next/server'
import { auth } from '../../../../auth'
import { client } from '@/sanity/lib/client'
import { writeClient } from '@/sanity/lib/client'

// POST - Upload avatar
export async function POST(request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('avatar')

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 5MB.' },
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

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Sanity
    const asset = await writeClient.assets.upload('image', buffer, {
      filename: `avatar-${session.user.id}-${Date.now()}.${file.type.split('/')[1]}`,
      contentType: file.type
    })

    // Update profile with new avatar
    const updatedProfile = await writeClient
      .patch(existingProfile._id)
      .set({
        avatar: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: asset._id
          }
        },
        updatedAt: new Date().toISOString()
      })
      .commit()

    return NextResponse.json({ 
      profile: updatedProfile,
      avatar: asset,
      message: 'Avatar uploaded successfully' 
    })
  } catch (error) {
    console.error('Error uploading avatar:', error)
    return NextResponse.json(
      { error: 'Failed to upload avatar' },
      { status: 500 }
    )
  }
}

// DELETE - Remove avatar
export async function DELETE() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
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

    // Remove avatar from profile
    const updatedProfile = await writeClient
      .patch(existingProfile._id)
      .unset(['avatar'])
      .set({ updatedAt: new Date().toISOString() })
      .commit()

    return NextResponse.json({ 
      profile: updatedProfile,
      message: 'Avatar removed successfully' 
    })
  } catch (error) {
    console.error('Error removing avatar:', error)
    return NextResponse.json(
      { error: 'Failed to remove avatar' },
      { status: 500 }
    )
  }
}