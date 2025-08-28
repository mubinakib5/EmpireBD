export default {
  name: 'productReview',
  title: 'Product Review',
  type: 'document',
  fields: [
    {
      name: 'product',
      title: 'Product',
      type: 'reference',
      to: [{ type: 'product' }],
      validation: Rule => Rule.required()
    },
    {
      name: 'rating',
      title: 'Rating',
      type: 'number',
      validation: Rule => Rule.required().min(1).max(5)
    },
    {
      name: 'text',
      title: 'Review Text',
      type: 'text',
      validation: Rule => Rule.required().min(10).max(1000)
    },
    {
      name: 'user',
      title: 'User',
      type: 'object',
      fields: [
        {
          name: 'name',
          title: 'Name',
          type: 'string',
          validation: Rule => Rule.required()
        },
        {
          name: 'email',
          title: 'Email',
          type: 'string',
          validation: Rule => Rule.required().email()
        },
        {
          name: 'userId',
          title: 'User ID',
          type: 'string'
        }
      ]
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    },
    {
      name: 'approved',
      title: 'Approved',
      type: 'boolean',
      initialValue: false
    }
  ],
  preview: {
    select: {
      title: 'user.name',
      subtitle: 'product.name',
      rating: 'rating'
    },
    prepare(selection) {
      const { title, subtitle, rating } = selection
      return {
        title: `${title} - ${rating}★`,
        subtitle: `Review for ${subtitle}`
      }
    }
  }
}