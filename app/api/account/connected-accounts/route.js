import { NextResponse } from 'next/server'
import { auth } from '../../../../auth'
import { client } from '@/sanity/lib/client'
import { writeClient } from '@/sanity/lib/client'

// GET - Fetch connected accounts
export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Note: This assumes you have an accounts schema in Sanity or similar
    // You might need to adjust this based on your NextAuth.js adapter configuration
    const accounts = await client.fetch(
      `*[_type == "account" && userId == $userId]{
        _id,
        provider,
        providerAccountId,
        type,
        createdAt
      }`,
      { userId: session.user.id }
    )

    // Transform accounts data for frontend
    const connectedAccounts = accounts.map(account => ({
      id: account._id,
      provider: account.provider,
      providerAccountId: account.providerAccountId,
      type: account.type,
      connectedAt: account.createdAt,
      displayName: getProviderDisplayName(account.provider)
    }))

    return NextResponse.json({ 
      connectedAccounts,
      canChangePassword: hasCredentialsProvider(accounts)
    })
  } catch (error) {
    console.error('Error fetching connected accounts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch connected accounts' },
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
    linkedin: 'LinkedIn',
    credentials: 'Email & Password'
  }
  return providerNames[provider] || provider.charAt(0).toUpperCase() + provider.slice(1)
}

// Helper function to check if user has credentials provider
function hasCredentialsProvider(accounts) {
  return accounts.some(account => account.provider === 'credentials')
}