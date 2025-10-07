import { NextResponse } from 'next/server'
// import { auth } from '../../../../auth' // Authentication system removed
import { client } from '../../../../sanity/lib/client'

// GET - Get connected accounts
export async function GET() {
  try {
    // Authentication system has been removed
    return NextResponse.json(
      { error: 'Authentication system not available' },
      { status: 501 }
    )
  } catch (error) {
    console.error('Connected accounts error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}