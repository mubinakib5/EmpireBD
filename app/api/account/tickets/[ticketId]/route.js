import { NextResponse } from 'next/server'
import { auth } from '../../../../../auth'
import { client } from '@/sanity/lib/client'
import { writeClient } from '@/sanity/lib/client'

// GET - Fetch specific support ticket
export async function GET(request, { params }) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { ticketId } = params

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

    // Fetch specific support ticket
    const ticket = await client.fetch(
      `*[_type == "supportTicket" && ticketId == $ticketId && customer._ref == $customerId][0] {
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
        ticketId,
        customerId: profile._id
      }
    )

    if (!ticket) {
      return NextResponse.json(
        { error: 'Support ticket not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ ticket })
  } catch (error) {
    console.error('Error fetching support ticket:', error)
    return NextResponse.json(
      { error: 'Failed to fetch support ticket' },
      { status: 500 }
    )
  }
}

// PATCH - Update support ticket
export async function PATCH(request, { params }) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { ticketId } = params
    const body = await request.json()
    const { status, response } = body

    // First, get the customer profile
    const profile = await client.fetch(
      `*[_type == "customerProfile" && authUserId == $userId][0]{
        _id,
        name,
        email
      }`,
      { userId: session.user.id }
    )

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    // Find existing ticket
    const existingTicket = await client.fetch(
      `*[_type == "supportTicket" && ticketId == $ticketId && customer._ref == $customerId][0]`,
      { 
        ticketId,
        customerId: profile._id
      }
    )

    if (!existingTicket) {
      return NextResponse.json(
        { error: 'Support ticket not found' },
        { status: 404 }
      )
    }

    // Prepare update data
    const updateData = {
      updatedAt: new Date().toISOString()
    }

    // Update status if provided
    if (status) {
      const validStatuses = ['pending', 'in-progress', 'resolved', 'closed']
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: 'Invalid status' },
          { status: 400 }
        )
      }
      
      updateData.status = status
      
      // Set resolved/closed timestamps
      if (status === 'resolved' && !existingTicket.resolvedAt) {
        updateData.resolvedAt = new Date().toISOString()
      }
      if (status === 'closed' && !existingTicket.closedAt) {
        updateData.closedAt = new Date().toISOString()
      }
    }

    // Add response if provided
    if (response && response.message) {
      const newResponse = {
        _key: `response-${Date.now()}`,
        message: response.message.trim(),
        author: profile.name || profile.email,
        authorType: 'customer',
        timestamp: new Date().toISOString(),
        attachments: response.attachments || []
      }
      
      const currentResponses = existingTicket.responses || []
      updateData.responses = [...currentResponses, newResponse]
    }

    // Update ticket
    const updatedTicket = await writeClient
      .patch(existingTicket._id)
      .set(updateData)
      .commit()

    // Fetch updated ticket with full details
    const fullTicket = await client.fetch(
      `*[_type == "supportTicket" && _id == $ticketId][0] {
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
      { ticketId: existingTicket._id }
    )

    return NextResponse.json({ 
      ticket: fullTicket,
      message: 'Support ticket updated successfully' 
    })
  } catch (error) {
    console.error('Error updating support ticket:', error)
    return NextResponse.json(
      { error: 'Failed to update support ticket' },
      { status: 500 }
    )
  }
}