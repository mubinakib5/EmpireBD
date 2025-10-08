import { NextResponse } from 'next/server'
import { writeClient, client } from '@/sanity/lib/client'
import { sendOrderConfirmationEmail } from '@/lib/emailService'

// GET - Fetch a specific order
export async function GET(request, { params }) {
  try {
    const { orderId } = params

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    const order = await client.fetch(
      `*[_type == "order" && _id == $orderId][0]{
        _id,
        orderNumber,
        cart,
        total,
        user,
        shippingAddress,
        status,
        paymentMethod,
        notes,
        createdAt,
        updatedAt,
        trackingNumber,
        estimatedDelivery,
        statusHistory
      }`,
      { orderId }
    )

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, order })

  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { error: 'Failed to fetch order', details: error.message },
      { status: 500 }
    )
  }
}

// PATCH - Update order status and other fields
export async function PATCH(request, { params }) {
  try {
    const { orderId } = params
    const body = await request.json()

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    // Get current order to check existing status
    const currentOrder = await client.fetch(
      `*[_type == "order" && _id == $orderId][0]{
        _id,
        orderNumber,
        status,
        user,
        cart,
        total,
        shippingAddress
      }`,
      { orderId }
    )

    if (!currentOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    const updateData = {
      updatedAt: new Date().toISOString()
    }

    // Handle status updates
    if (body.status && body.status !== currentOrder.status) {
      updateData.status = body.status
      
      // Add to status history
      const statusHistoryEntry = {
        status: body.status,
        timestamp: new Date().toISOString(),
        note: body.statusNote || `Status changed to ${body.status}`
      }

      updateData.statusHistory = [
        ...(currentOrder.statusHistory || []),
        statusHistoryEntry
      ]

      // Send confirmation email if status changed to 'confirmed'
      if (body.status === 'confirmed' && currentOrder.status !== 'confirmed') {
        const emailData = {
          orderNumber: currentOrder.orderNumber,
          customerName: currentOrder.user.name,
          customerEmail: currentOrder.user.email,
          customerPhone: currentOrder.user.phone,
          total: currentOrder.total,
          items: currentOrder.cart.map(item => ({
            productName: item.productName || 'Product',
            quantity: item.quantity,
            price: item.price,
            size: item.size,
            productSlug: item.productSlug
          })),
          shippingAddress: currentOrder.shippingAddress
        }

        // Send confirmation email asynchronously
        sendOrderConfirmationEmail(emailData).catch(error => {
          console.error('Failed to send order confirmation email:', error)
        })
      }
    }

    // Handle other field updates
    if (body.trackingNumber !== undefined) {
      updateData.trackingNumber = body.trackingNumber
    }

    if (body.estimatedDelivery !== undefined) {
      updateData.estimatedDelivery = body.estimatedDelivery
    }

    if (body.notes !== undefined) {
      updateData.notes = body.notes
    }

    // Update the order
    const result = await writeClient
      .patch(orderId)
      .set(updateData)
      .commit()

    return NextResponse.json({ 
      success: true, 
      order: result,
      emailSent: body.status === 'confirmed' && currentOrder.status !== 'confirmed'
    })

  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: 'Failed to update order', details: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Cancel/delete an order
export async function DELETE(request, { params }) {
  try {
    const { orderId } = params

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    // Check if order exists
    const order = await client.fetch(
      `*[_type == "order" && _id == $orderId][0]{ _id, status }`,
      { orderId }
    )

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Instead of deleting, mark as cancelled
    const result = await writeClient
      .patch(orderId)
      .set({
        status: 'cancelled',
        updatedAt: new Date().toISOString(),
        statusHistory: [
          ...(order.statusHistory || []),
          {
            status: 'cancelled',
            timestamp: new Date().toISOString(),
            note: 'Order cancelled'
          }
        ]
      })
      .commit()

    return NextResponse.json({ 
      success: true, 
      message: 'Order cancelled successfully',
      order: result
    })

  } catch (error) {
    console.error('Error cancelling order:', error)
    return NextResponse.json(
      { error: 'Failed to cancel order', details: error.message },
      { status: 500 }
    )
  }
}