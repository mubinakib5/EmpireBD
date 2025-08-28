import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'
import { client } from '@/sanity/lib/client'

// POST - Export user data
export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get customer profile
    const profile = await client.fetch(
      `*[_type == "customerProfile" && authUserId == $userId][0]{
        _id,
        authUserId,
        email,
        name,
        avatar,
        phone,
        dateOfBirth,
        gender,
        addresses,
        preferences,
        socialLinks,
        createdAt,
        updatedAt
      }`,
      { userId: session.user.id }
    )

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    // Get user orders
    const orders = await client.fetch(
      `*[_type == "order" && customer._ref == $customerId] | order(createdAt desc) {
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
      { customerId: profile._id }
    )

    // Get support tickets
    const tickets = await client.fetch(
      `*[_type == "supportTicket" && customer._ref == $customerId] | order(createdAt desc) {
        _id,
        ticketId,
        subject,
        description,
        category,
        priority,
        status,
        responses[] {
          message,
          author,
          authorType,
          timestamp
        },
        relatedOrder->{
          _id,
          orderNumber
        },
        tags,
        createdAt,
        updatedAt,
        resolvedAt,
        closedAt
      }`,
      { customerId: profile._id }
    )

    // Get wishlist with product details
    const wishlist = await client.fetch(
      `*[_type == "customerProfile" && _id == $profileId][0]{
        wishlist[]->{
          _id,
          name,
          slug,
          price,
          discountedPrice
        }
      }`,
      { profileId: profile._id }
    )

    // Compile all user data
    const userData = {
      exportDate: new Date().toISOString(),
      profile: {
        ...profile,
        // Remove internal Sanity fields
        _id: undefined,
        authUserId: undefined
      },
      orders: orders.map(order => ({
        ...order,
        _id: undefined
      })),
      supportTickets: tickets.map(ticket => ({
        ...ticket,
        _id: undefined
      })),
      wishlist: wishlist?.wishlist || [],
      summary: {
        totalOrders: orders.length,
        totalTickets: tickets.length,
        wishlistItems: wishlist?.wishlist?.length || 0,
        accountCreated: profile.createdAt,
        lastUpdated: profile.updatedAt
      }
    }

    // Create downloadable JSON
    const jsonData = JSON.stringify(userData, null, 2)
    const buffer = Buffer.from(jsonData, 'utf-8')

    // Set headers for file download
    const headers = new Headers()
    headers.set('Content-Type', 'application/json')
    headers.set('Content-Disposition', `attachment; filename="user-data-export-${Date.now()}.json"`)
    headers.set('Content-Length', buffer.length.toString())

    return new NextResponse(buffer, {
      status: 200,
      headers
    })
  } catch (error) {
    console.error('Error exporting user data:', error)
    return NextResponse.json(
      { error: 'Failed to export user data' },
      { status: 500 }
    )
  }
}