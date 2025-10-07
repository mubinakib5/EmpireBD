import { NextResponse } from 'next/server'
// import { auth } from '../../../../../../auth' // Authentication system removed

// POST - Cancel order
export async function POST() {
  try {
    // Authentication system has been removed
    return NextResponse.json(
      { error: 'Authentication system not available' },
      { status: 501 }
    )
  } catch (error) {
    console.error('Order cancellation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}