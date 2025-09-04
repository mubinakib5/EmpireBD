import { NextResponse } from 'next/server'
import { auth } from '../../../../auth'
import { client } from '@/sanity/lib/client'
import { writeClient } from '@/sanity/lib/client'

// GET - Fetch user support tickets
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

    // First, get the customer profile
    const profile = await client.fetch(
      `*[_type == "customerProfile" && authUserId == $userId][0]{
        _id
      }`,
      { userId: session.user.id }
    )

    // If no profile exists, return empty tickets array
    if (!profile) {
      return NextResponse.json({ 
        tickets: [],
        pagination: {
          total: 0,
          limit,
          offset,
          hasMore: false
        }
      })
    }

    // Build query filter
    let statusFilter = ''
    if (status && status !== 'all') {
      statusFilter = ` && status == "${status}"`
    }

    // Fetch support tickets for this customer
    const tickets = await client.fetch(
      `*[_type == "supportTicket" && customer._ref == $customerId${statusFilter}] | order(createdAt desc) [$offset...$end] {
        _id,
        ticketId,
        subject,
        description,
        category,
        priority,
        status,
        attachments,
        assignedTo,
        responses[] {
          message,
          author,
          authorType,
          timestamp,
          attachments
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
      { 
        customerId: profile._id,
        offset,
        end: offset + limit
      }
    )

    // Get total count for pagination
    const totalCount = await client.fetch(
      `count(*[_type == "supportTicket" && customer._ref == $customerId${statusFilter}])`,
      { customerId: profile._id }
    )

    return NextResponse.json({ 
      tickets,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    })
  } catch (error) {
    console.error('Error fetching support tickets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch support tickets' },
      { status: 500 }
    )
  }
}

// POST - Create new support ticket
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
    const { subject, description, category, priority, relatedOrderId, attachments } = body

    // Validate required fields
    if (!subject || !description) {
      return NextResponse.json(
        { error: 'Subject and description are required' },
        { status: 400 }
      )
    }

    // Validate category
    const validCategories = ['general', 'order', 'product', 'shipping', 'billing', 'technical', 'other']
    if (category && !validCategories.includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      )
    }

    // Validate priority
    const validPriorities = ['low', 'medium', 'high', 'urgent']
    if (priority && !validPriorities.includes(priority)) {
      return NextResponse.json(
        { error: 'Invalid priority' },
        { status: 400 }
      )
    }

    // First, get the customer profile
    const profile = await client.fetch(
      `*[_type == "customerProfile" && authUserId == $userId][0]{
        _id
      }`,
      { userId: session.user.id }
    )

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    // Validate related order if provided
    let relatedOrder = null
    if (relatedOrderId) {
      relatedOrder = await client.fetch(
        `*[_type == "order" && _id == $orderId && customer._ref == $customerId][0]`,
        { orderId: relatedOrderId, customerId: profile._id }
      )
      
      if (!relatedOrder) {
        return NextResponse.json(
          { error: 'Related order not found or does not belong to user' },
          { status: 404 }
        )
      }
    }

    // Generate ticket ID
    const ticketId = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`

    // Create support ticket
    const newTicket = {
      _type: 'supportTicket',
      ticketId,
      customer: {
        _type: 'reference',
        _ref: profile._id
      },
      subject: subject.trim(),
      description: description.trim(),
      category: category || 'general',
      priority: priority || 'medium',
      status: 'pending',
      attachments: attachments || [],
      assignedTo: null,
      responses: [],
      relatedOrder: relatedOrder ? {
        _type: 'reference',
        _ref: relatedOrder._id
      } : null,
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      resolvedAt: null,
      closedAt: null
    }

    const createdTicket = await writeClient.create(newTicket)

    return NextResponse.json({ 
      ticket: createdTicket,
      message: 'Support ticket created successfully' 
    })
  } catch (error) {
    console.error('Error creating support ticket:', error)
    return NextResponse.json(
      { error: 'Failed to create support ticket' },
      { status: 500 }
    )
  }
}