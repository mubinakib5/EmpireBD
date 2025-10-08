import { NextResponse } from 'next/server'
// import { auth } from '../../../../auth' // Authentication system removed
import { client } from '@/sanity/lib/client'
import { writeClient } from '@/sanity/lib/client'
import { v4 as uuidv4 } from 'uuid'

// GET - Fetch user addresses
export async function GET() {
  try {
    // Authentication system has been removed
    return NextResponse.json(
      { error: 'Authentication system not available' },
      { status: 501 }
    )

    // Fetch customer profile with addresses
    const profile = await client.fetch(
      `*[_type == "customerProfile" && authUserId == $userId][0]{
        addresses
      }`,
      { userId: session.user.id }
    )

    // If no profile exists, return empty addresses array
    if (!profile) {
      return NextResponse.json({ addresses: [] })
    }

    return NextResponse.json({ addresses: profile.addresses || [] })
  } catch (error) {
    console.error('Error fetching addresses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch addresses' },
      { status: 500 }
    )
  }
}

// POST - Add new address
export async function POST(request) {
  try {
    // Authentication system has been removed
    return NextResponse.json(
      { error: 'Authentication system not available' },
      { status: 501 }
    )

    const body = await request.json()
    const { 
      label, 
      recipientName, 
      phone, 
      streetLine1, 
      streetLine2, 
      city, 
      stateRegion, 
      postalCode, 
      countryCode, 
      isDefault 
    } = body

    // Validate required fields
    if (!label || !recipientName || !streetLine1 || !city || !postalCode || !countryCode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate label
    if (!['Home', 'Work', 'Other'].includes(label)) {
      return NextResponse.json(
        { error: 'Invalid label. Must be Home, Work, or Other' },
        { status: 400 }
      )
    }

    // Validate country code (ISO 3166-1 alpha-2)
    if (!/^[A-Z]{2}$/.test(countryCode)) {
      return NextResponse.json(
        { error: 'Invalid country code. Must be ISO 3166-1 alpha-2 format' },
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

    const currentAddresses = existingProfile.addresses || []
    
    // Create new address
    const newAddress = {
      id: uuidv4(),
      label,
      recipientName: recipientName.trim(),
      phone: phone?.trim() || '',
      streetLine1: streetLine1.trim(),
      streetLine2: streetLine2?.trim() || '',
      city: city.trim(),
      stateRegion: stateRegion?.trim() || '',
      postalCode: postalCode.trim(),
      countryCode: countryCode.toUpperCase(),
      isDefault: Boolean(isDefault)
    }

    // If this is set as default, unset all other defaults
    let updatedAddresses = currentAddresses
    if (newAddress.isDefault) {
      updatedAddresses = currentAddresses.map(addr => ({
        ...addr,
        isDefault: false
      }))
    }

    // Add new address
    updatedAddresses.push(newAddress)

    // Update profile
    const updatedProfile = await writeClient
      .patch(existingProfile._id)
      .set({
        addresses: updatedAddresses,
        updatedAt: new Date().toISOString()
      })
      .commit()

    return NextResponse.json({ 
      address: newAddress,
      addresses: updatedAddresses,
      message: 'Address added successfully' 
    })
  } catch (error) {
    console.error('Error adding address:', error)
    return NextResponse.json(
      { error: 'Failed to add address' },
      { status: 500 }
    )
  }
}

// PATCH - Update existing address
export async function PATCH(request) {
  try {
    // Authentication system has been removed
    return NextResponse.json(
      { error: 'Authentication system not available' },
      { status: 501 }
    )

    const body = await request.json()
    const { addressId, ...updateData } = body

    if (!addressId) {
      return NextResponse.json(
        { error: 'Address ID is required' },
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

    const currentAddresses = existingProfile.addresses || []
    const addressIndex = currentAddresses.findIndex(addr => addr.id === addressId)

    if (addressIndex === -1) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      )
    }

    // Update address
    let updatedAddresses = [...currentAddresses]
    updatedAddresses[addressIndex] = {
      ...updatedAddresses[addressIndex],
      ...updateData
    }

    // If this address is set as default, unset all other defaults
    if (updateData.isDefault) {
      updatedAddresses = updatedAddresses.map((addr, index) => ({
        ...addr,
        isDefault: index === addressIndex
      }))
    }

    // Update profile
    const updatedProfile = await writeClient
      .patch(existingProfile._id)
      .set({
        addresses: updatedAddresses,
        updatedAt: new Date().toISOString()
      })
      .commit()

    return NextResponse.json({ 
      address: updatedAddresses[addressIndex],
      addresses: updatedAddresses,
      message: 'Address updated successfully' 
    })
  } catch (error) {
    console.error('Error updating address:', error)
    return NextResponse.json(
      { error: 'Failed to update address' },
      { status: 500 }
    )
  }
}

// DELETE - Remove address
export async function DELETE(request) {
  try {
    // Authentication system has been removed
    return NextResponse.json(
      { error: 'Authentication system not available' },
      { status: 501 }
    )

    const { searchParams } = new URL(request.url)
    const addressId = searchParams.get('id')

    if (!addressId) {
      return NextResponse.json(
        { error: 'Address ID is required' },
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

    const currentAddresses = existingProfile.addresses || []
    const addressToDelete = currentAddresses.find(addr => addr.id === addressId)

    if (!addressToDelete) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      )
    }

    // Remove address
    const updatedAddresses = currentAddresses.filter(addr => addr.id !== addressId)

    // If deleted address was default and there are other addresses, make the first one default
    if (addressToDelete.isDefault && updatedAddresses.length > 0) {
      updatedAddresses[0].isDefault = true
    }

    // Update profile
    const updatedProfile = await writeClient
      .patch(existingProfile._id)
      .set({
        addresses: updatedAddresses,
        updatedAt: new Date().toISOString()
      })
      .commit()

    return NextResponse.json({ 
      addresses: updatedAddresses,
      message: 'Address deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting address:', error)
    return NextResponse.json(
      { error: 'Failed to delete address' },
      { status: 500 }
    )
  }
}