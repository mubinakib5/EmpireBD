export default {
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    {
      name: 'orderNumber',
      title: 'Order Number',
      type: 'string',
      readOnly: true
    },
    {
      name: 'cart',
      title: 'Cart Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'product',
              title: 'Product Reference',
              type: 'reference',
              to: [{ type: 'product' }],
              validation: Rule => Rule.required()
            },
            {
              name: 'productName',
              title: 'Product Name',
              type: 'string',
              description: 'Product name at time of purchase'
            },
            {
              name: 'productSlug',
              title: 'Product Slug',
              type: 'string',
              description: 'Product slug for URL generation'
            },
            {
              name: 'productImage',
              title: 'Product Image',
              type: 'image',
              description: 'Main product image at time of purchase'
            },
            {
              name: 'quantity',
              title: 'Quantity',
              type: 'number',
              validation: Rule => Rule.required().min(1)
            },
            {
              name: 'price',
              title: 'Price at Purchase',
              type: 'number',
              validation: Rule => Rule.required()
            },
            {
              name: 'size',
              title: 'Selected Size',
              type: 'string'
            }
          ],
          preview: {
            select: {
              title: 'productName',
              subtitle: 'size',
              media: 'productImage',
              quantity: 'quantity',
              price: 'price'
            },
            prepare(selection) {
              const { title, subtitle, media, quantity, price } = selection
              return {
                title: title || 'Product',
                subtitle: `${quantity}x - ${subtitle ? `Size: ${subtitle} - ` : ''}৳${price}`,
                media: media
              }
            }
          }
        }
      ],
      validation: Rule => Rule.required().min(1)
    },
    {
      name: 'total',
      title: 'Total Amount',
      type: 'number',
      validation: Rule => Rule.required().min(0)
    },
    {
      name: 'customer',
      title: 'Customer Profile',
      type: 'reference',
      to: [{ type: 'customerProfile' }],
      description: 'Reference to customer profile'
    },
    {
      name: 'user',
      title: 'Customer Information',
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
          name: 'phone',
          title: 'Phone Number',
          type: 'string'
        },
        {
          name: 'userId',
          title: 'User ID',
          type: 'string'
        }
      ],
      validation: Rule => Rule.required()
    },
    {
      name: 'shippingAddress',
      title: 'Shipping Address',
      type: 'object',
      fields: [
        {
          name: 'street',
          title: 'Street Address',
          type: 'string',
          validation: Rule => Rule.required()
        },
        {
          name: 'city',
          title: 'City',
          type: 'string',
          validation: Rule => Rule.required()
        },
        {
          name: 'state',
          title: 'State/Province',
          type: 'string'
        },
        {
          name: 'postalCode',
          title: 'Postal Code',
          type: 'string',
          validation: Rule => Rule.required()
        },
        {
          name: 'country',
          title: 'Country',
          type: 'string',
          validation: Rule => Rule.required()
        }
      ],
      validation: Rule => Rule.required()
    },
    {
      name: 'status',
      title: 'Order Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Confirmed', value: 'confirmed' },
          { title: 'Processing', value: 'processing' },
          { title: 'Shipped', value: 'shipped' },
          { title: 'Delivered', value: 'delivered' },
          { title: 'Cancelled', value: 'cancelled' }
        ]
      },
      initialValue: 'pending',
      validation: Rule => Rule.required()
    },
    {
      name: 'paymentMethod',
      title: 'Payment Method',
      type: 'string',
      options: {
        list: [
          { title: 'Cash on Delivery', value: 'cod' }
        ]
      },
      initialValue: 'cod'
    },
    {
      name: 'notes',
      title: 'Order Notes',
      type: 'text'
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
      type: 'datetime'
    },
    {
      name: 'trackingNumber',
      title: 'Tracking Number',
      type: 'string',
      description: 'Shipping tracking number'
    },
    {
      name: 'estimatedDelivery',
      title: 'Estimated Delivery Date',
      type: 'date'
    },
    {
      name: 'statusHistory',
      title: 'Status History',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'status',
              title: 'Status',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'timestamp',
              title: 'Timestamp',
              type: 'datetime',
              validation: Rule => Rule.required()
            },
            {
              name: 'note',
              title: 'Note',
              type: 'string'
            }
          ]
        }
      ]
    }
  ],
  preview: {
    select: {
      title: 'orderNumber',
      subtitle: 'user.name',
      status: 'status',
      total: 'total'
    },
    prepare(selection) {
      const { title, subtitle, status, total } = selection
      return {
        title: title || 'New Order',
        subtitle: `${subtitle} - ৳${total?.toLocaleString()} (${status})`
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
      title: 'Created Date, Old',
      name: 'createdAtAsc',
      by: [{ field: 'createdAt', direction: 'asc' }]
    }
  ]
}