import { NextResponse } from 'next/server'
import { writeClient, client } from '@/sanity/lib/client'

// POST - Create a new order
export async function POST(request) {
  try {
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

    // Find or create customer profile based on email
    let customerProfile = await client.fetch(
      `*[_type == "customerProfile" && email == $email][0]{
        _id
      }`,
      { email: orderData.user.email }
    )

    // If no customer profile exists, create one
    if (!customerProfile) {
      customerProfile = await writeClient.create({
        _type: 'customerProfile',
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

    // Trigger email notifications (don't wait for completion to avoid blocking)
    const emailData = {
      orderNumber: orderData.orderNumber,
      customerName: orderData.user.name,
      customerEmail: orderData.user.email,
      customerPhone: orderData.user.phone,
      total: orderData.total,
      items: orderData.cart.map(item => ({
        productName: item.productName || 'Product',
        quantity: item.quantity,
        price: item.price,
        size: item.size,
        productSlug: item.productSlug,
        productImage: item.productImage
      })),
      shippingAddress: orderData.shippingAddress
    }

    // Send emails asynchronously (don't block order creation)
    fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/emails/order-confirmation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderData: emailData })
    }).catch(error => {
      console.error('Failed to send order confirmation emails:', error)
    })

    return NextResponse.json({ 
      success: true, 
      orderId: result._id,
      orderNumber: orderData.orderNumber,
      emailNotification: 'Queued' // Indicate that email notification is being processed
    })

  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order', details: error.message },
      { status: 500 }
    )
  }
}