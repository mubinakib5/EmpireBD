import { NextResponse } from 'next/server'
import { auth } from '../../../../auth'
import { client, writeClient } from '@/sanity/lib/client'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// GET - Fetch user orders
export async function GET(request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit')) || 20
    const offset = parseInt(searchParams.get('offset')) || 0

    // Build query filter
    let statusFilter = ''
    if (status && status !== 'all') {
      statusFilter = ` && status == "${status}"`
    }

    // First, get the customer profile
    let profile = await client.fetch(
      `*[_type == "customerProfile" && authUserId == $userId][0]{
        _id
      }`,
      { userId: session.user.id }
    )

    // If no profile exists, create one from existing order data
    if (!profile) {
      // Check if there are any orders with this user ID that don't have a customer reference
      const orphanedOrder = await client.fetch(
        `*[_type == "order" && user.userId == $userId && customer == null][0]{
          _id,
          user
        }`,
        { userId: session.user.id }
      )
      
      if (orphanedOrder) {
        // Create customer profile from the orphaned order's user data
        const newProfile = await writeClient.create({
          _type: 'customerProfile',
          authUserId: session.user.id,
          email: orphanedOrder.user.email,
          name: orphanedOrder.user.name,
          phone: orphanedOrder.user.phone
        })
        
        // Update the orphaned order to reference the new customer profile
        await writeClient.patch(orphanedOrder._id).set({
          customer: {
            _type: 'reference',
            _ref: newProfile._id
          }
        }).commit()
        
        // Use the new profile for the rest of the function
        profile = newProfile
      }
    }

    // If no profile exists, return empty orders array
    if (!profile) {
      return NextResponse.json({ 
        orders: [],
        pagination: {
          total: 0,
          limit,
          offset,
          hasMore: false
        }
      })
    }

    // Fetch orders for this customer
    const orders = await client.fetch(
      `*[_type == "order" && customer._ref == $customerId${statusFilter}] | order(createdAt desc) [$offset...$end] {
        _id,
        orderNumber,
        status,
        total,
        trackingNumber,
        estimatedDelivery,
        statusHistory,
        cart[] {
          product->{
            _id,
            name,
            slug,
            images[]{
              asset->{
                _id,
                url
              },
              alt
            },
            price
          },
          quantity,
          price
        },
        shippingAddress,
        paymentMethod,
        notes,
        createdAt,
        updatedAt
      }`,
      { 
        customerId: profile._id,
        offset,
        end: offset + limit
      }
    )



    // Get total count for pagination
    const totalCount = await client.fetch(
      `count(*[_type == "order" && customer._ref == $customerId${statusFilter}])`,
      { customerId: profile._id }
    )

    return NextResponse.json({ 
      orders,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}