'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ProfileTab from '@/components/dashboard/ProfileTab'
import AddressesTab from '@/components/dashboard/AddressesTab'
import WishlistTab from '@/components/dashboard/WishlistTab'
import OrdersTab from '@/components/dashboard/OrdersTab'
import SupportTicketsTab from '@/components/dashboard/SupportTicketsTab'
import SecurityTab from '@/components/dashboard/SecurityTab'
import NotificationsTab from '@/components/dashboard/NotificationsTab'
import DangerZoneTab from '@/components/dashboard/DangerZoneTab'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('profile')

  useEffect(() => {
    if (status === 'loading') return // Still loading
    if (!session) {
      router.push('/auth/signin')
      return
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your account, orders, and preferences</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 gap-2">
            <TabsTrigger value="profile" className="text-sm">
              Profile
            </TabsTrigger>
            <TabsTrigger value="addresses" className="text-sm">
              Addresses
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="text-sm">
              Wishlist
            </TabsTrigger>
            <TabsTrigger value="orders" className="text-sm">
              Orders
            </TabsTrigger>
            <TabsTrigger value="support" className="text-sm">
              Support
            </TabsTrigger>
            <TabsTrigger value="security" className="text-sm">
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-sm">
              Notifications
            </TabsTrigger>
            <TabsTrigger value="danger" className="text-sm text-red-600">
              Danger Zone
            </TabsTrigger>
          </TabsList>

          <div className="bg-white rounded-lg shadow-sm border">
            <TabsContent value="profile" className="p-6">
              <ProfileTab session={session} />
            </TabsContent>
            
            <TabsContent value="addresses" className="p-6">
              <AddressesTab session={session} />
            </TabsContent>
            
            <TabsContent value="wishlist" className="p-6">
              <WishlistTab session={session} />
            </TabsContent>
            
            <TabsContent value="orders" className="p-6">
              <OrdersTab session={session} />
            </TabsContent>
            
            <TabsContent value="support" className="p-6">
              <SupportTicketsTab session={session} />
            </TabsContent>
            
            <TabsContent value="security" className="p-6">
              <SecurityTab session={session} />
            </TabsContent>
            
            <TabsContent value="notifications" className="p-6">
              <NotificationsTab session={session} />
            </TabsContent>
            
            <TabsContent value="danger" className="p-6">
              <DangerZoneTab session={session} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}