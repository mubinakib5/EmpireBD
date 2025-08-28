import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'
import { client } from '@/sanity/lib/client'
import { writeClient } from '@/sanity/lib/client'

// GET - Fetch user preferences
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch customer profile with preferences
    const profile = await client.fetch(
      `*[_type == "customerProfile" && authUserId == $userId][0]{
        preferences
      }`,
      { userId: session.user.id }
    )

    // Return preferences with defaults if profile not found
    const defaultPreferences = {
      locale: 'en-US',
      currency: 'BDT',
      timezone: 'UTC',
      marketingOptIn: false,
      newsletterOptIn: false,
      productUpdatesOptIn: false,
      orderNotifications: true,
      accountNotifications: true,
      emailFrequency: 'immediate'
    }

    if (!profile) {
      return NextResponse.json({ preferences: defaultPreferences })
    }

    const preferences = {
      ...defaultPreferences,
      ...profile.preferences
    }

    return NextResponse.json({ preferences })
  } catch (error) {
    console.error('Error fetching preferences:', error)
    return NextResponse.json(
      { error: 'Failed to fetch preferences' },
      { status: 500 }
    )
  }
}

// PATCH - Update user preferences
export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { 
      locale, 
      currency, 
      timezone,
      marketingOptIn, 
      newsletterOptIn, 
      productUpdatesOptIn,
      orderNotifications,
      accountNotifications,
      emailFrequency
    } = body

    // Validate locale
    if (locale && !/^[a-z]{2}-[A-Z]{2}$/.test(locale)) {
      return NextResponse.json(
        { error: 'Invalid locale format. Use format like en-US' },
        { status: 400 }
      )
    }

    // Validate currency
    const validCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'BDT']
    if (currency && !validCurrencies.includes(currency)) {
      return NextResponse.json(
        { error: 'Invalid currency code' },
        { status: 400 }
      )
    }

    // Validate email frequency
    const validFrequencies = ['immediate', 'daily', 'weekly', 'never']
    if (emailFrequency && !validFrequencies.includes(emailFrequency)) {
      return NextResponse.json(
        { error: 'Invalid email frequency' },
        { status: 400 }
      )
    }

    // Find existing profile
    const existingProfile = await client.fetch(
      `*[_type == "customerProfile" && authUserId == $userId][0]`,
      { userId: session.user.id }
    )

    if (!existingProfile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    // Prepare updated preferences
    const currentPreferences = existingProfile.preferences || {}
    const updatedPreferences = { ...currentPreferences }

    if (locale !== undefined) updatedPreferences.locale = locale
    if (currency !== undefined) updatedPreferences.currency = currency
    if (timezone !== undefined) updatedPreferences.timezone = timezone
    if (marketingOptIn !== undefined) updatedPreferences.marketingOptIn = Boolean(marketingOptIn)
    if (newsletterOptIn !== undefined) updatedPreferences.newsletterOptIn = Boolean(newsletterOptIn)
    if (productUpdatesOptIn !== undefined) updatedPreferences.productUpdatesOptIn = Boolean(productUpdatesOptIn)
    if (orderNotifications !== undefined) updatedPreferences.orderNotifications = Boolean(orderNotifications)
    if (accountNotifications !== undefined) updatedPreferences.accountNotifications = Boolean(accountNotifications)
    if (emailFrequency !== undefined) updatedPreferences.emailFrequency = emailFrequency

    // Update profile
    const updatedProfile = await writeClient
      .patch(existingProfile._id)
      .set({
        preferences: updatedPreferences,
        updatedAt: new Date().toISOString()
      })
      .commit()

    return NextResponse.json({ 
      preferences: updatedPreferences,
      message: 'Preferences updated successfully' 
    })
  } catch (error) {
    console.error('Error updating preferences:', error)
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    )
  }
}

// POST - Reset preferences to defaults
export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Find existing profile
    const existingProfile = await client.fetch(
      `*[_type == "customerProfile" && authUserId == $userId][0]`,
      { userId: session.user.id }
    )

    if (!existingProfile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    // Reset to default preferences
    const defaultPreferences = {
      locale: 'en-US',
      currency: 'BDT',
      timezone: 'UTC',
      marketingOptIn: false,
      newsletterOptIn: false,
      productUpdatesOptIn: false,
      orderNotifications: true,
      accountNotifications: true,
      emailFrequency: 'immediate'
    }

    // Update profile
    const updatedProfile = await writeClient
      .patch(existingProfile._id)
      .set({
        preferences: defaultPreferences,
        updatedAt: new Date().toISOString()
      })
      .commit()

    return NextResponse.json({ 
      preferences: defaultPreferences,
      message: 'Preferences reset to defaults successfully' 
    })
  } catch (error) {
    console.error('Error resetting preferences:', error)
    return NextResponse.json(
      { error: 'Failed to reset preferences' },
      { status: 500 }
    )
  }
}