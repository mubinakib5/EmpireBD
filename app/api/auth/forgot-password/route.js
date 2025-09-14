import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { writeClient } from '@/sanity/lib/client'
import crypto from 'crypto'
import { sendPasswordResetEmail } from '@/lib/emailService'

// POST - Request password reset
export async function POST(request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if user exists with credentials provider
    const user = await client.fetch(
      `*[_type == "user" && email == $email && provider == "credentials"][0]{
        _id,
        email,
        name
      }`,
      { email: email.toLowerCase() }
    )

    // Always return success message for security (don't reveal if email exists)
    const successMessage = 'If an account with that email exists, a password reset link has been sent.'

    if (!user) {
      // Return success message even if user doesn't exist (security best practice)
      return NextResponse.json({ 
        message: successMessage 
      })
    }

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    // Store reset token in user document
    await writeClient
      .patch(user._id)
      .set({
        resetToken,
        resetTokenExpiry: resetTokenExpiry.toISOString(),
        updatedAt: new Date().toISOString()
      })
      .commit()

    // Send password reset email
    try {
      await sendPasswordResetEmail({
        to: user.email,
        name: user.name || 'User',
        resetToken,
        resetUrl: `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`
      })
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError)
      
      // Clean up the reset token if email fails
      await writeClient
        .patch(user._id)
        .unset(['resetToken', 'resetTokenExpiry'])
        .commit()
      
      return NextResponse.json(
        { error: 'Failed to send reset email. Please try again later.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      message: successMessage 
    })
  } catch (error) {
    console.error('Error in forgot password:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}