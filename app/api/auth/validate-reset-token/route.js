import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'

// POST - Validate password reset token
export async function POST(request) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json(
        { error: 'Reset token is required' },
        { status: 400 }
      )
    }

    // Find user with this reset token
    const user = await client.fetch(
      `*[_type == "user" && resetToken == $token][0]{
        _id,
        resetToken,
        resetTokenExpiry
      }`,
      { token }
    )

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid reset token' },
        { status: 400 }
      )
    }

    // Check if token has expired
    const now = new Date()
    const expiry = new Date(user.resetTokenExpiry)
    
    if (now > expiry) {
      return NextResponse.json(
        { error: 'Reset token has expired' },
        { status: 400 }
      )
    }

    return NextResponse.json({ 
      valid: true,
      message: 'Token is valid' 
    })
  } catch (error) {
    console.error('Error validating reset token:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}