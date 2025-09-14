import { NextResponse } from 'next/server'
import { auth } from '../../../../../../auth'
import { client, writeClient } from '@/sanity/lib/client'

// POST - Cancel an order
export async function POST(request, { params }) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { orderId } = params

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    // Get customer profile
    const profile = await client.fetch(
      `*[_type == "customerProfile" && authUserId == $userId][0]{
        _id
      }`,
      { userId: session.user.id }
    )

    if (!profile) {
      return NextResponse.json(
        { error: 'Customer profile not found' },
        { status: 404 }
      )
    }

    // Fetch the order to verify ownership and current status
    const order = await client.fetch(
      `*[_type == "order" && _id == $orderId && customer._ref == $customerId][0]{
        _id,
        orderNumber,
        status,
        statusHistory
      }`,
      { 
        orderId,
        customerId: profile._id 
      }
    )

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found or does not belong to user' },
        { status: 404 }
      )
    }

    // Check if order can be cancelled
    const cancellableStatuses = ['pending', 'confirmed']
    if (!cancellableStatuses.includes(order.status)) {
      return NextResponse.json(
        { error: `Cannot cancel order with status: ${order.status}` },
        { status: 400 }
      )
    }

    // Update order status to cancelled
    const updatedOrder = await writeClient
      .patch(order._id)
      .set({
        status: 'cancelled',
        updatedAt: new Date().toISOString(),
        statusHistory: [
          ...(order.statusHistory || []),
          {
            status: 'cancelled',
            timestamp: new Date().toISOString(),
            note: 'Order cancelled by customer'
          }
        ]
      })
      .commit()

    return NextResponse.json({
      success: true,
      message: 'Order cancelled successfully',
      order: {
        _id: updatedOrder._id,
        orderNumber: order.orderNumber,
        status: 'cancelled'
      }
    })

  } catch (error) {
    console.error('Error cancelling order:', error)
    return NextResponse.json(
      { error: 'Failed to cancel order', details: error.message },
      { status: 500 }
    )
  }
}