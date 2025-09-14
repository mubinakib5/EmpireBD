import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { writeClient } from '@/sanity/lib/client'
import bcrypt from 'bcrypt'

// POST - Reset password with token
export async function POST(request) {
  try {
    const body = await request.json()
    const { token, password } = body

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Check for password complexity
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      return NextResponse.json(
        { error: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character' },
        { status: 400 }
      )
    }

    // Find user with this reset token
    const user = await client.fetch(
      `*[_type == "user" && resetToken == $token][0]{
        _id,
        email,
        resetToken,
        resetTokenExpiry,
        password
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

    // Check if new password is different from current password
    if (user.password) {
      const isSamePassword = await bcrypt.compare(password, user.password)
      if (isSamePassword) {
        return NextResponse.json(
          { error: 'New password must be different from your current password' },
          { status: 400 }
        )
      }
    }

    // Hash new password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Update user password and clear reset token
    await writeClient
      .patch(user._id)
      .set({
        password: hashedPassword,
        updatedAt: new Date().toISOString()
      })
      .unset(['resetToken', 'resetTokenExpiry'])
      .commit()

    return NextResponse.json({ 
      message: 'Password reset successfully' 
    })
  } catch (error) {
    console.error('Error resetting password:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}