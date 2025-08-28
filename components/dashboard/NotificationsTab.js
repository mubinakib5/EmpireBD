'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'

export default function NotificationsTab({ session }) {
  const [preferences, setPreferences] = useState({
    marketingOptIn: false,
    newsletterOptIn: false,
    productUpdatesOptIn: false,
    orderUpdatesOptIn: true,
    securityAlertsOptIn: true,
    promotionalOptIn: false,
    reviewRemindersOptIn: true,
    wishlistNotificationsOptIn: true,
    locale: 'en-US',
    currency: 'BDT',
    timezone: 'America/New_York',
    emailFrequency: 'immediate'
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [originalPreferences, setOriginalPreferences] = useState({})

  useEffect(() => {
    fetchPreferences()
  }, [])

  const fetchPreferences = async () => {
    try {
      const response = await fetch('/api/account/preferences')
      if (response.ok) {
        const data = await response.json()
        const prefs = data.preferences || preferences
        setPreferences(prefs)
        setOriginalPreferences(prefs)
      }
    } catch (error) {
      console.error('Error fetching preferences:', error)
      toast.error('Failed to load notification preferences')
    } finally {
      setLoading(false)
    }
  }

  const handlePreferenceChange = (key, value) => {
    const newPreferences = { ...preferences, [key]: value }
    setPreferences(newPreferences)
    
    // Check if there are changes
    const hasChanges = JSON.stringify(newPreferences) !== JSON.stringify(originalPreferences)
    setHasChanges(hasChanges)
  }

  const handleSavePreferences = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/account/preferences', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ preferences })
      })

      if (response.ok) {
        toast.success('Notification preferences updated successfully!')
        setOriginalPreferences(preferences)
        setHasChanges(false)
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to update preferences')
      }
    } catch (error) {
      toast.error('An error occurred while updating preferences')
    } finally {
      setSaving(false)
    }
  }

  const handleResetPreferences = () => {
    setPreferences(originalPreferences)
    setHasChanges(false)
  }

  const notificationCategories = [
    {
      title: 'Order & Account',
      description: 'Important updates about your orders and account',
      items: [
        {
          key: 'orderUpdatesOptIn',
          label: 'Order Updates',
          description: 'Notifications about order status, shipping, and delivery',
          required: true
        },
        {
          key: 'securityAlertsOptIn',
          label: 'Security Alerts',
          description: 'Important security notifications and login alerts',
          required: true
        },
        {
          key: 'reviewRemindersOptIn',
          label: 'Review Reminders',
          description: 'Reminders to review products you\'ve purchased'
        }
      ]
    },
    {
      title: 'Marketing & Promotions',
      description: 'Stay updated with our latest offers and news',
      items: [
        {
          key: 'marketingOptIn',
          label: 'Marketing Emails',
          description: 'Promotional emails, special offers, and marketing content'
        },
        {
          key: 'newsletterOptIn',
          label: 'Newsletter',
          description: 'Weekly newsletter with company updates and featured products'
        },
        {
          key: 'promotionalOptIn',
          label: 'Promotional Offers',
          description: 'Exclusive deals, discounts, and limited-time offers'
        }
      ]
    },
    {
      title: 'Product & Wishlist',
      description: 'Updates about products and your wishlist',
      items: [
        {
          key: 'productUpdatesOptIn',
          label: 'Product Updates',
          description: 'New product launches, restocks, and product improvements'
        },
        {
          key: 'wishlistNotificationsOptIn',
          label: 'Wishlist Notifications',
          description: 'Alerts when wishlist items go on sale or are back in stock'
        }
      ]
    }
  ]

  const localeOptions = [
    { value: 'en-US', label: 'English (US)' },
    { value: 'en-GB', label: 'English (UK)' },
    { value: 'es-ES', label: 'Español' },
    { value: 'fr-FR', label: 'Français' },
    { value: 'de-DE', label: 'Deutsch' },
    { value: 'it-IT', label: 'Italiano' },
    { value: 'pt-BR', label: 'Português (Brasil)' },
    { value: 'ja-JP', label: '日本語' },
    { value: 'ko-KR', label: '한국어' },
    { value: 'zh-CN', label: '中文 (简体)' }
  ]

  const currencyOptions = [
        { value: 'BDT', label: 'Bangladeshi Taka (৳)' },
        { value: 'USD', label: 'US Dollar ($)' },
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'GBP', label: 'British Pound (£)' },
    { value: 'CAD', label: 'Canadian Dollar (C$)' },
    { value: 'AUD', label: 'Australian Dollar (A$)' },
    { value: 'JPY', label: 'Japanese Yen (¥)' },
    { value: 'KRW', label: 'Korean Won (₩)' },
    { value: 'CNY', label: 'Chinese Yuan (¥)' },
    { value: 'INR', label: 'Indian Rupee (₹)' },
    { value: 'BRL', label: 'Brazilian Real (R$)' }
  ]

  const timezoneOptions = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
    { value: 'Europe/Paris', label: 'Central European Time (CET)' },
    { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
    { value: 'Asia/Seoul', label: 'Korea Standard Time (KST)' },
    { value: 'Asia/Shanghai', label: 'China Standard Time (CST)' },
    { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)' }
  ]

  const frequencyOptions = [
    { value: 'immediate', label: 'Immediate', description: 'Send notifications as they happen' },
    { value: 'daily', label: 'Daily Digest', description: 'Send a daily summary of notifications' },
    { value: 'weekly', label: 'Weekly Digest', description: 'Send a weekly summary of notifications' },
    { value: 'never', label: 'Never', description: 'Don\'t send email notifications (except required ones)' }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notification Preferences</h2>
          <p className="text-gray-600 mt-1">Manage how and when you receive notifications</p>
        </div>
        
        {hasChanges && (
          <div className="flex items-center space-x-3">
            <button
              onClick={handleResetPreferences}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Reset
            </button>
            <button
              onClick={handleSavePreferences}
              disabled={saving}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      {/* Email Frequency */}
      <div className="bg-white border rounded-lg p-6">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900">Email Frequency</h3>
          <p className="text-sm text-gray-600">Choose how often you want to receive email notifications</p>
        </div>
        
        <div className="space-y-3">
          {frequencyOptions.map((option) => (
            <label key={option.value} className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                name="emailFrequency"
                value={option.value}
                checked={preferences.emailFrequency === option.value}
                onChange={(e) => handlePreferenceChange('emailFrequency', e.target.value)}
                className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300"
              />
              <div>
                <div className="text-sm font-medium text-gray-900">{option.label}</div>
                <div className="text-sm text-gray-600">{option.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Notification Categories */}
      {notificationCategories.map((category) => (
        <div key={category.title} className="bg-white border rounded-lg p-6">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900">{category.title}</h3>
            <p className="text-sm text-gray-600">{category.description}</p>
          </div>
          
          <div className="space-y-4">
            {category.items.map((item) => (
              <div key={item.key} className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-medium text-gray-900">{item.label}</h4>
                    {item.required && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                        Required
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                </div>
                
                <div className="ml-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences[item.key]}
                      onChange={(e) => handlePreferenceChange(item.key, e.target.checked)}
                      disabled={item.required}
                      className="sr-only"
                    />
                    <div className={`w-11 h-6 rounded-full transition-colors ${
                      preferences[item.key] ? 'bg-primary' : 'bg-gray-200'
                    } ${item.required ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                        preferences[item.key] ? 'translate-x-5' : 'translate-x-0'
                      } mt-0.5 ml-0.5`}></div>
                    </div>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Localization Settings */}
      <div className="bg-white border rounded-lg p-6">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900">Localization</h3>
          <p className="text-sm text-gray-600">Set your preferred language, currency, and timezone</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Language
            </label>
            <select
              value={preferences.locale}
              onChange={(e) => handlePreferenceChange('locale', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              {localeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Currency
            </label>
            <select
              value={preferences.currency}
              onChange={(e) => handlePreferenceChange('currency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              {currencyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Timezone
            </label>
            <select
              value={preferences.timezone}
              onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              {timezoneOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Email Preview */}
      <div className="bg-white border rounded-lg p-6">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900">Email Preview</h3>
          <p className="text-sm text-gray-600">See how your email notifications will look</p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">EB</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">EmpireBD</p>
                <p className="text-xs text-gray-500">noreply@empirebd.com</p>
              </div>
            </div>
            <span className="text-xs text-gray-500">2 minutes ago</span>
          </div>
          
          <div className="border-l-4 border-primary pl-4">
            <h4 className="text-sm font-medium text-gray-900 mb-1">
              Your order has been shipped! 📦
            </h4>
            <p className="text-sm text-gray-600">
              Hi {session?.user?.name || 'Customer'}, your order #ORD-12345 is on its way. 
              Track your package and get delivery updates.
            </p>
            <div className="mt-2">
              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary">
                Order Update
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button (Fixed at bottom when changes exist) */}
      {hasChanges && (
        <div className="fixed bottom-6 right-6 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">You have unsaved changes</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleResetPreferences}
                className="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Reset
              </button>
              <button
                onClick={handleSavePreferences}
                disabled={saving}
                className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}