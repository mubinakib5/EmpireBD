export default {
  name: 'productViewer',
  title: 'Product Viewer',
  type: 'document',
  fields: [
    {
      name: 'productId',
      title: 'Product ID',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'sessionId',
      title: 'Session ID',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'userAgent',
      title: 'User Agent',
      type: 'string'
    },
    {
      name: 'ipAddress',
      title: 'IP Address',
      type: 'string'
    },
    {
      name: 'joinedAt',
      title: 'Joined At',
      type: 'datetime',
      validation: Rule => Rule.required()
    },
    {
      name: 'lastSeen',
      title: 'Last Seen',
      type: 'datetime',
      validation: Rule => Rule.required()
    },
    {
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      initialValue: true
    }
  ],
  preview: {
    select: {
      productId: 'productId',
      sessionId: 'sessionId',
      joinedAt: 'joinedAt',
      isActive: 'isActive'
    },
    prepare(selection) {
      const {productId, sessionId, joinedAt, isActive} = selection
      return {
        title: `${productId} - ${sessionId.substring(0, 8)}...`,
        subtitle: `${isActive ? '🟢 Active' : '🔴 Inactive'} - ${new Date(joinedAt).toLocaleString()}`
      }
    }
  }
}