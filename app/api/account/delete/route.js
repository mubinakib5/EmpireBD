import { NextResponse } from 'next/server'
import { auth } from '../../../../auth'
import { client } from '@/sanity/lib/client'
import { writeClient } from '@/sanity/lib/client'

// POST - Delete user account
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
    const { confirmationText, reason } = body

    // Validate confirmation text
    if (confirmationText !== 'DELETE') {
      return NextResponse.json(
        { error: 'Invalid confirmation text. Please type "DELETE" to confirm.' },
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
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    // Start deletion process
    const deletionResults = {
      profile: false,
      orders: false,
      tickets: false,
      accounts: false,
      user: false
    }

    try {
      // 1. Delete support tickets
      const tickets = await client.fetch(
        `*[_type == "supportTicket" && customer._ref == $customerId]`,
        { customerId: profile._id }
      )
      
      for (const ticket of tickets) {
        await writeClient.delete(ticket._id)
      }
      deletionResults.tickets = true

      // 2. Update orders to remove customer reference (preserve order history for business records)
      const orders = await client.fetch(
        `*[_type == "order" && customer._ref == $customerId]`,
        { customerId: profile._id }
      )
      
      for (const order of orders) {
        await writeClient
          .patch(order._id)
          .unset(['customer'])
          .set({
            deletedCustomer: {
              deletedAt: new Date().toISOString(),
              reason: reason || 'User requested account deletion'
            },
            updatedAt: new Date().toISOString()
          })
          .commit()
      }
      deletionResults.orders = true

      // 3. Delete customer profile
      await writeClient.delete(profile._id)
      deletionResults.profile = true

      // 4. Delete authentication accounts
      const accounts = await client.fetch(
        `*[_type == "account" && userId == $userId]`,
        { userId: session.user.id }
      )
      
      for (const account of accounts) {
        await writeClient.delete(account._id)
      }
      deletionResults.accounts = true

      // 5. Delete user record (if exists in Sanity)
      const user = await client.fetch(
        `*[_type == "user" && email == $email][0]`,
        { email: session.user.email }
      )
      
      if (user) {
        await writeClient.delete(user._id)
      }
      deletionResults.user = true

      // Log deletion for audit purposes
      await writeClient.create({
        _type: 'accountDeletion',
        deletedUserId: session.user.id,
        deletedEmail: session.user.email,
        reason: reason || 'User requested account deletion',
        deletionResults,
        deletedAt: new Date().toISOString(),
        deletedBy: 'user'
      })

      return NextResponse.json({ 
        message: 'Account deleted successfully',
        deletionResults
      })
    } catch (deletionError) {
      console.error('Error during account deletion:', deletionError)
      
      // Log partial deletion for recovery purposes
      await writeClient.create({
        _type: 'accountDeletionError',
        userId: session.user.id,
        email: session.user.email,
        reason: reason || 'User requested account deletion',
        deletionResults,
        error: deletionError.message,
        attemptedAt: new Date().toISOString()
      })

      return NextResponse.json(
        { 
          error: 'Partial deletion occurred. Please contact support.',
          deletionResults
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error deleting account:', error)
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    )
  }
}