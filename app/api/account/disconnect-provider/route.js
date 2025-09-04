import { NextResponse } from 'next/server'
import { auth } from '../../../../auth'
import { client } from '@/sanity/lib/client'
import { writeClient } from '@/sanity/lib/client'

// POST - Disconnect OAuth provider
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
    const { provider } = body

    if (!provider) {
      return NextResponse.json(
        { error: 'Provider is required' },
        { status: 400 }
      )
    }

    // Prevent disconnecting credentials provider if it's the only one
    if (provider === 'credentials') {
      return NextResponse.json(
        { error: 'Cannot disconnect email & password authentication' },
        { status: 400 }
      )
    }

    // Get all user accounts
    const accounts = await client.fetch(
      `*[_type == "account" && userId == $userId]`,
      { userId: session.user.id }
    )

    // Check if user has other authentication methods
    const otherAccounts = accounts.filter(account => account.provider !== provider)
    
    if (otherAccounts.length === 0) {
      return NextResponse.json(
        { error: 'Cannot disconnect the only authentication method. Please add another authentication method first.' },
        { status: 400 }
      )
    }

    // Find the account to disconnect
    const accountToDisconnect = accounts.find(account => account.provider === provider)
    
    if (!accountToDisconnect) {
      return NextResponse.json(
        { error: 'Provider not found in connected accounts' },
        { status: 404 }
      )
    }

    // Delete the account
    await writeClient.delete(accountToDisconnect._id)

    // Update customer profile if exists
    const profile = await client.fetch(
      `*[_type == "customerProfile" && authUserId == $userId][0]`,
      { userId: session.user.id }
    )

    if (profile) {
      await writeClient
        .patch(profile._id)
        .set({
          updatedAt: new Date().toISOString()
        })
        .commit()
    }

    return NextResponse.json({ 
      message: `${getProviderDisplayName(provider)} account disconnected successfully` 
    })
  } catch (error) {
    console.error('Error disconnecting provider:', error)
    return NextResponse.json(
      { error: 'Failed to disconnect provider' },
      { status: 500 }
    )
  }
}

// Helper function to get provider display name
function getProviderDisplayName(provider) {
  const providerNames = {
    google: 'Google',
    github: 'GitHub',
    facebook: 'Facebook',
    twitter: 'Twitter',
    linkedin: 'LinkedIn'
  }
  return providerNames[provider] || provider.charAt(0).toUpperCase() + provider.slice(1)
}