import { NextResponse } from 'next/server'
import { auth } from '../../../../auth'
import { sendOrderEmails } from '@/lib/emailService'
import { client } from '@/sanity/lib/client'

// POST - Send order confirmation emails
export async function POST(request) {
  try {
    const session = await auth()
    
    // Allow both authenticated users and system calls
    const body = await request.json()
    const { orderData, orderId } = body

    if (!orderData && !orderId) {
      return NextResponse.json(
        { error: 'Order data or order ID is required' },
        { status: 400 }
      )
    }

    let emailData = orderData

    // If only orderId is provided, fetch order data from Sanity
    if (!orderData && orderId) {
      const order = await client.fetch(
        `*[_type == "order" && _id == $orderId][0]{
          _id,
          orderNumber,
          total,
          user,
          shippingAddress,
          cart[]{
            quantity,
            price,
            size,
            product->{
              name,
              slug
            }
          },
          createdAt
        }`,
        { orderId }
      )

      if (!order) {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        )
      }

      // Transform order data for email
      emailData = {
        orderNumber: order.orderNumber,
        customerName: order.user.name,
        customerEmail: order.user.email,
        customerPhone: order.user.phone,
        total: order.total,
        items: order.cart.map(item => ({
          productName: item.product?.name || 'Product',
          quantity: item.quantity,
          price: item.price,
          size: item.size
        })),
        shippingAddress: order.shippingAddress
      }
    }

    // Validate required email data
    const requiredFields = ['orderNumber', 'customerName', 'customerEmail', 'total', 'items', 'shippingAddress']
    for (const field of requiredFields) {
      if (!emailData[field]) {
        return NextResponse.json(
          { error: `${field} is required for email sending` },
          { status: 400 }
        )
      }
    }

    // Check if required environment variables are set
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error('Gmail credentials not configured')
      return NextResponse.json(
        { error: 'Email service not configured. Please contact administrator.' },
        { status: 500 }
      )
    }

    // Send emails
    const emailResults = await sendOrderEmails(emailData)

    // Check if at least one email was sent successfully
    const customerEmailSent = emailResults.customer.success
    const adminEmailSent = emailResults.admin.success

    if (!customerEmailSent && !adminEmailSent) {
      return NextResponse.json(
        { 
          error: 'Failed to send emails',
          details: {
            customer: emailResults.customer.error,
            admin: emailResults.admin.error
          }
        },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true,
      message: 'Order confirmation emails processed',
      results: {
        customerEmail: {
          sent: customerEmailSent,
          messageId: emailResults.customer.messageId,
          error: emailResults.customer.error
        },
        adminEmail: {
          sent: adminEmailSent,
          messageId: emailResults.admin.messageId,
          error: emailResults.admin.error
        }
      }
    })

  } catch (error) {
    console.error('Error in order confirmation email API:', error)
    return NextResponse.json(
      { error: 'Failed to process email request', details: error.message },
      { status: 500 }
    )
  }
}

// GET - Test email configuration
export async function GET() {
  try {
    const session = await auth()
    
    // Only allow authenticated admin users to test email config
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check email configuration
    const isConfigured = !!(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD)
    
    return NextResponse.json({
      configured: isConfigured,
      gmailUser: process.env.GMAIL_USER ? '***@gmail.com' : 'Not set',
      adminEmail: process.env.ADMIN_EMAIL || 'Not set (will use GMAIL_USER)',
      message: isConfigured 
        ? 'Email service is properly configured' 
        : 'Email service requires GMAIL_USER and GMAIL_APP_PASSWORD environment variables'
    })

  } catch (error) {
    console.error('Error checking email configuration:', error)
    return NextResponse.json(
      { error: 'Failed to check email configuration' },
      { status: 500 }
    )
  }
}