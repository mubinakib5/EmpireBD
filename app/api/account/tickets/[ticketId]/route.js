import { NextResponse } from 'next/server'
// import { auth } from '../../../../../auth' // Authentication system removed

// GET - Get ticket details
export async function GET() {
  try {
    // Authentication system has been removed
    return NextResponse.json(
      { error: 'Authentication system not available' },
      { status: 501 }
    )
  } catch (error) {
    console.error('Ticket fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Add response to ticket
export async function POST() {
  try {
    // Authentication system has been removed
    return NextResponse.json(
      { error: 'Authentication system not available' },
      { status: 501 }
    )
  } catch (error) {
    console.error('Ticket response error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}