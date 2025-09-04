import { NextResponse } from 'next/server'
import { auth } from '../../../auth'
import { writeClient, client } from '@/sanity/lib/client'

// POST - Create a new order
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
    const { orderData } = body

    if (!orderData) {
      return NextResponse.json(
        { error: 'Order data is required' },
        { status: 400 }
      )
    }

    // Validate required fields
    const requiredFields = ['orderNumber', 'cart', 'total', 'user', 'shippingAddress']
    for (const field of requiredFields) {
      if (!orderData[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Ensure the order belongs to the authenticated user
    if (orderData.user.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized - User ID mismatch' },
        { status: 403 }
      )
    }

    // Find or create customer profile
    let customerProfile = await client.fetch(
      `*[_type == "customerProfile" && authUserId == $userId][0]{
        _id
      }`,
      { userId: session.user.id }
    )

    // If no customer profile exists, create one
    if (!customerProfile) {
      customerProfile = await writeClient.create({
        _type: 'customerProfile',
        authUserId: session.user.id,
        email: orderData.user.email,
        name: orderData.user.name,
        phone: orderData.user.phone
      })
    }

    // Create the order document with customer reference
    const orderDoc = {
      _type: 'order',
      ...orderData,
      customer: {
        _type: 'reference',
        _ref: customerProfile._id
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Submit to Sanity using writeClient (server-side with token)
    const result = await writeClient.create(orderDoc)

    return NextResponse.json({ 
      success: true, 
      orderId: result._id,
      orderNumber: orderData.orderNumber
    })

  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order', details: error.message },
      { status: 500 }
    )
  }
}