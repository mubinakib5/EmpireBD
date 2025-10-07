import { NextResponse } from 'next/server'
// import { auth } from '../../../../auth' // Authentication system removed
// import bcrypt from 'bcrypt' // Authentication system removed
import { client } from '../../../../sanity/lib/client'

// POST - Change password
export async function POST() {
  try {
    // Authentication system has been removed
    return NextResponse.json(
      { error: 'Authentication system not available' },
      { status: 501 }
    )
  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}