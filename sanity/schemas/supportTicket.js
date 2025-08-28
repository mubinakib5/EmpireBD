export default {
  name: 'supportTicket',
  title: 'Support Ticket',
  type: 'document',
  fields: [
    {
      name: 'ticketId',
      title: 'Ticket ID',
      type: 'string',
      description: 'Auto-generated unique ticket identifier',
      readOnly: true
    },
    {
      name: 'customer',
      title: 'Customer',
      type: 'reference',
      to: [{ type: 'customerProfile' }],
      validation: Rule => Rule.required()
    },
    {
      name: 'subject',
      title: 'Subject',
      type: 'string',
      validation: Rule => Rule.required().min(5).max(200)
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: Rule => Rule.required().min(10)
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'General Inquiry', value: 'general' },
          { title: 'Order Issue', value: 'order' },
          { title: 'Product Question', value: 'product' },
          { title: 'Shipping Problem', value: 'shipping' },
          { title: 'Return/Refund', value: 'return' },
          { title: 'Technical Support', value: 'technical' },
          { title: 'Account Issue', value: 'account' },
          { title: 'Other', value: 'other' }
        ]
      },
      initialValue: 'general'
    },
    {
      name: 'priority',
      title: 'Priority',
      type: 'string',
      options: {
        list: [
          { title: 'Low', value: 'low' },
          { title: 'Medium', value: 'medium' },
          { title: 'High', value: 'high' },
          { title: 'Urgent', value: 'urgent' }
        ]
      },
      initialValue: 'medium'
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'In Progress', value: 'in_progress' },
          { title: 'Waiting for Customer', value: 'waiting_customer' },
          { title: 'Resolved', value: 'resolved' },
          { title: 'Closed', value: 'closed' }
        ]
      },
      initialValue: 'pending'
    },
    {
      name: 'attachments',
      title: 'Attachments',
      type: 'array',
      of: [
        {
          type: 'file',
          options: {
            accept: '.pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif'
          }
        }
      ]
    },
    {
      name: 'assignedTo',
      title: 'Assigned To',
      type: 'string',
      description: 'Admin user assigned to handle this ticket'
    },
    {
      name: 'responses',
      title: 'Responses',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'message',
              title: 'Message',
              type: 'text',
              validation: Rule => Rule.required()
            },
            {
              name: 'author',
              title: 'Author',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'authorType',
              title: 'Author Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Customer', value: 'customer' },
                  { title: 'Admin', value: 'admin' }
                ]
              },
              validation: Rule => Rule.required()
            },
            {
              name: 'timestamp',
              title: 'Timestamp',
              type: 'datetime',
              initialValue: () => new Date().toISOString()
            },
            {
              name: 'attachments',
              title: 'Attachments',
              type: 'array',
              of: [
                {
                  type: 'file'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'relatedOrder',
      title: 'Related Order',
      type: 'reference',
      to: [{ type: 'order' }],
      description: 'Link to order if ticket is order-related'
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags'
      }
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    },
    {
      name: 'updatedAt',
      title: 'Updated At',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    },
    {
      name: 'resolvedAt',
      title: 'Resolved At',
      type: 'datetime'
    },
    {
      name: 'closedAt',
      title: 'Closed At',
      type: 'datetime'
    }
  ],
  preview: {
    select: {
      title: 'subject',
      subtitle: 'status',
      description: 'customer.name'
    },
    prepare({ title, subtitle, description }) {
      return {
        title: title,
        subtitle: `${subtitle?.toUpperCase()} - ${description || 'Unknown Customer'}`
      }
    }
  },
  orderings: [
    {
      title: 'Created Date, New',
      name: 'createdAtDesc',
      by: [{ field: 'createdAt', direction: 'desc' }]
    },
    {
      title: 'Priority, High to Low',
      name: 'priorityDesc',
      by: [{ field: 'priority', direction: 'desc' }]
    },
    {
      title: 'Status',
      name: 'status',
      by: [{ field: 'status', direction: 'asc' }]
    }
  ]
}