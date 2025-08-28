'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'

export default function SupportTicketsTab({ session }) {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [showNewTicketForm, setShowNewTicketForm] = useState(false)
  const [filter, setFilter] = useState('all')
  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    category: 'general',
    priority: 'medium',
    relatedOrder: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/account/tickets')
      if (response.ok) {
        const data = await response.json()
        setTickets(data.tickets || [])
      }
    } catch (error) {
      console.error('Error fetching tickets:', error)
      toast.error('Failed to load support tickets')
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!newTicket.subject.trim()) {
      newErrors.subject = 'Subject is required'
    }
    
    if (!newTicket.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (newTicket.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmitTicket = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fix the errors below')
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch('/api/account/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTicket)
      })

      if (response.ok) {
        toast.success('Support ticket submitted successfully!')
        await fetchTickets()
        setShowNewTicketForm(false)
        setNewTicket({
          subject: '',
          description: '',
          category: 'general',
          priority: 'medium',
          relatedOrder: ''
        })
        setErrors({})
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to submit ticket')
      }
    } catch (error) {
      toast.error('An error occurred while submitting the ticket')
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateTicketStatus = async (ticketId, status) => {
    try {
      const response = await fetch(`/api/account/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        toast.success('Ticket status updated!')
        await fetchTickets()
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to update ticket status')
      }
    } catch (error) {
      toast.error('An error occurred while updating the ticket')
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-primary/10 text-primary',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800',
      urgent: 'bg-purple-100 text-purple-800'
    }
    return colors[priority] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleInputChange = (field, value) => {
    setNewTicket(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'all') return true
    return ticket.status === filter
  })

  const statusCounts = tickets.reduce((acc, ticket) => {
    acc[ticket.status] = (acc[ticket.status] || 0) + 1
    return acc
  }, {})

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
          <h2 className="text-2xl font-bold text-gray-900">Support Tickets</h2>
          <p className="text-gray-600 mt-1">Get help with your orders and account</p>
        </div>
        <button
          onClick={() => setShowNewTicketForm(true)}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          New Ticket
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'all', label: 'All Tickets', count: tickets.length },
            { key: 'pending', label: 'Pending', count: statusCounts.pending || 0 },
            { key: 'in-progress', label: 'In Progress', count: statusCounts['in-progress'] || 0 },
            { key: 'resolved', label: 'Resolved', count: statusCounts.resolved || 0 },
            { key: 'closed', label: 'Closed', count: statusCounts.closed || 0 }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                filter === tab.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                  filter === tab.key
                    ? 'bg-primary/10 text-primary'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* New Ticket Form */}
      {showNewTicketForm && (
        <div className="bg-white border rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Submit New Ticket</h3>
            <button
              onClick={() => {
                setShowNewTicketForm(false)
                setNewTicket({
                  subject: '',
                  description: '',
                  category: 'general',
                  priority: 'medium',
                  relatedOrder: ''
                })
                setErrors({})
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmitTicket} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  value={newTicket.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="general">General Inquiry</option>
                  <option value="order">Order Issue</option>
                  <option value="payment">Payment Problem</option>
                  <option value="shipping">Shipping Issue</option>
                  <option value="product">Product Question</option>
                  <option value="account">Account Issue</option>
                  <option value="technical">Technical Support</option>
                  <option value="refund">Refund Request</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority *
                </label>
                <select
                  value={newTicket.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Related Order (Optional)
              </label>
              <input
                type="text"
                value={newTicket.relatedOrder}
                onChange={(e) => handleInputChange('relatedOrder', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Order number (e.g., ORD-12345)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject *
              </label>
              <input
                type="text"
                value={newTicket.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                  errors.subject ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Brief description of your issue"
              />
              {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                value={newTicket.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Please provide detailed information about your issue..."
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              <p className="text-sm text-gray-500 mt-1">
                {newTicket.description.length}/500 characters (minimum 10)
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowNewTicketForm(false)
                  setNewTicket({
                    subject: '',
                    description: '',
                    category: 'general',
                    priority: 'medium',
                    relatedOrder: ''
                  })
                  setErrors({})
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Ticket'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tickets List */}
      {filteredTickets.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {filter === 'all' ? 'No support tickets' : `No ${filter} tickets`}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {filter === 'all' 
              ? 'Submit a ticket if you need help with anything.'
              : `You don't have any ${filter} tickets at the moment.`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTickets.map((ticket) => (
            <div key={ticket._id} className="bg-white border rounded-lg overflow-hidden">
              <div className="px-6 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {ticket.subject}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {ticket.status.replace('-', ' ').toUpperCase()}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <span>Ticket #{ticket.ticketId}</span>
                      <span>•</span>
                      <span className="capitalize">{ticket.category}</span>
                      <span>•</span>
                      <span>Created {formatDate(ticket.createdAt)}</span>
                      {ticket.relatedOrder && (
                        <>
                          <span>•</span>
                          <span>Order: {ticket.relatedOrder}</span>
                        </>
                      )}
                    </div>
                    
                    <p className="text-gray-700 mb-4">{ticket.description}</p>
                    
                    {ticket.responses && ticket.responses.length > 0 && (
                      <div className="border-t pt-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          Latest Response:
                        </h4>
                        <div className="bg-gray-50 rounded-md p-3">
                          <p className="text-sm text-gray-700">
                            {ticket.responses[ticket.responses.length - 1].message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {ticket.responses[ticket.responses.length - 1].authorType === 'admin' ? 'Support Team' : 'You'} • 
                            {formatDate(ticket.responses[ticket.responses.length - 1].timestamp)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="text-sm text-gray-500">
                    {ticket.assignedTo && (
                      <span>Assigned to: {ticket.assignedTo}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {ticket.status === 'resolved' && (
                      <button
                        onClick={() => handleUpdateTicketStatus(ticket._id, 'closed')}
                        className="text-green-600 hover:text-green-800 text-sm font-medium"
                      >
                        Mark as Closed
                      </button>
                    )}
                    
                    {ticket.status === 'pending' && (
                      <button
                        onClick={() => handleUpdateTicketStatus(ticket._id, 'closed')}
                        className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                      >
                        Close Ticket
                      </button>
                    )}
                    
                    <button className="text-primary hover:text-primary/80 text-sm font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}