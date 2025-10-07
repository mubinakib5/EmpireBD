'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DangerZoneTab() {

  const handleExportData = async () => {
    setExportLoading(true)
    try {
      const response = await fetch('/api/account/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          format: exportFormat,
          sections: exportSections
        })
      })

      if (response.ok) {
        const data = await response.json()
        toast.success('Data export request submitted! You will receive an email with download link within 24 hours.')
        setShowExportModal(false)
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to request data export')
      }
    } catch (error) {
      toast.error('An error occurred while requesting data export')
    } finally {
      setExportLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      toast.error('Please type "DELETE" to confirm account deletion')
      return
    }

    if (!deleteReason.trim()) {
      toast.error('Please provide a reason for account deletion')
      return
    }

    setDeleteLoading(true)
    try {
      const response = await fetch('/api/account/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          confirmation: deleteConfirmation,
          reason: deleteReason
        })
      })

      if (response.ok) {
        toast.success('Account deletion request submitted. You will be logged out shortly.')
        setTimeout(() => {
          signOut({ callbackUrl: '/' })
        }, 2000)
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to delete account')
      }
    } catch (error) {
      toast.error('An error occurred while deleting account')
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleExportSectionChange = (section, checked) => {
    setExportSections(prev => ({
      ...prev,
      [section]: checked
    }))
  }

  const exportSectionLabels = {
    profile: 'Profile Information',
    orders: 'Order History',
    addresses: 'Saved Addresses',
    wishlist: 'Wishlist Items',
    supportTickets: 'Support Tickets',
    preferences: 'Account Preferences'
  }

  const deleteReasons = [
    'No longer need the service',
    'Privacy concerns',
    'Found a better alternative',
    'Too expensive',
    'Difficult to use',
    'Poor customer service',
    'Technical issues',
    'Other'
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Danger Zone</h2>
        <p className="text-gray-600 mt-1">Irreversible and destructive actions</p>
      </div>

      {/* Data Export */}
      <div className="bg-white border border-orange-200 rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900">Export Account Data</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Download a copy of all your account data including profile information, orders, addresses, and preferences. 
              This process may take up to 24 hours and you will receive an email with the download link.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>• Includes all personal data</span>
              <span>• Available in JSON or CSV format</span>
              <span>• Secure download link via email</span>
            </div>
          </div>
          <button
            onClick={() => setShowExportModal(true)}
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Export Data
          </button>
        </div>
      </div>

      {/* Account Deletion */}
      <div className="bg-white border border-red-200 rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900">Delete Account</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Permanently delete your account and all associated data. This action cannot be undone. 
              All your orders, addresses, wishlist items, and support tickets will be permanently removed.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              <div className="flex items-start space-x-2">
                <svg className="w-4 h-4 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div className="text-sm text-red-700">
                  <p className="font-medium mb-1">This will permanently:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Delete your profile and personal information</li>
                    <li>Remove all order history and tracking data</li>
                    <li>Delete saved addresses and payment methods</li>
                    <li>Clear your wishlist and preferences</li>
                    <li>Close all support tickets</li>
                    <li>Revoke access to your account</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>• Cannot be undone</span>
              <span>• Data removed within 30 days</span>
              <span>• May require admin approval</span>
            </div>
          </div>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Export Account Data</h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Export Format
                </label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="format"
                      value="json"
                      checked={exportFormat === 'json'}
                      onChange={(e) => setExportFormat(e.target.value)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                    />
                    <span className="text-sm text-gray-900">JSON (Recommended)</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="format"
                      value="csv"
                      checked={exportFormat === 'csv'}
                      onChange={(e) => setExportFormat(e.target.value)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                    />
                    <span className="text-sm text-gray-900">CSV (Spreadsheet)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data to Include
                </label>
                <div className="space-y-2">
                  {Object.entries(exportSectionLabels).map(([key, label]) => (
                    <label key={key} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={exportSections[key]}
                        onChange={(e) => handleExportSectionChange(key, e.target.checked)}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-900">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-md p-3">
                <div className="flex">
                  <svg className="w-4 h-4 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="ml-3">
                    <div className="text-sm text-primary">
                      <p>Your data export will be processed within 24 hours. You will receive an email with a secure download link that expires after 7 days.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                onClick={handleExportData}
                disabled={exportLoading || !Object.values(exportSections).some(Boolean)}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {exportLoading ? 'Requesting...' : 'Request Export'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Delete Account</h3>
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteConfirmation('')
                  setDeleteReason('')
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <div className="flex items-start space-x-2">
                  <svg className="w-4 h-4 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div className="text-sm text-red-700">
                    <p className="font-medium">This action cannot be undone!</p>
                    <p>All your data will be permanently deleted.</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for deletion (required)
                </label>
                <select
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Select a reason...</option>
                  {deleteReasons.map((reason) => (
                    <option key={reason} value={reason}>{reason}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type {"DELETE"} to confirm
                </label>
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="DELETE"
                />
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-1">What happens next:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Your account will be immediately deactivated</li>
                    <li>You will be logged out of all devices</li>
                    <li>Data deletion will be completed within 30 days</li>
                    <li>Some data may be retained for legal compliance</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteConfirmation('')
                  setDeleteReason('')
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteLoading || deleteConfirmation !== 'DELETE' || !deleteReason}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteLoading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}