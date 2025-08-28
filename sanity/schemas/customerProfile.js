export default {
  name: 'customerProfile',
  title: 'Customer Profile',
  type: 'document',
  fields: [
    {
      name: 'authUserId',
      title: 'Auth User ID',
      type: 'string',
      description: 'Links to the user from NextAuth',
      validation: Rule => Rule.required()
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: Rule => Rule.required().email()
    },
    {
      name: 'name',
      title: 'Full Name',
      type: 'string'
    },
    {
      name: 'avatar',
      title: 'Profile Avatar',
      type: 'image',
      options: {
        hotspot: true
      }
    },
    {
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      description: 'E.164 format preferred'
    },
    {
      name: 'dateOfBirth',
      title: 'Date of Birth',
      type: 'date'
    },
    {
      name: 'gender',
      title: 'Gender',
      type: 'string',
      options: {
        list: [
          { title: 'Male', value: 'male' },
          { title: 'Female', value: 'female' },
          { title: 'Other', value: 'other' },
          { title: 'Prefer not to say', value: 'not_specified' }
        ]
      }
    },
    {
      name: 'addresses',
      title: 'Addresses',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Address Label',
              type: 'string',
              options: {
                list: [
                  { title: 'Home', value: 'home' },
                  { title: 'Work', value: 'work' },
                  { title: 'Other', value: 'other' }
                ]
              }
            },
            {
              name: 'recipientName',
              title: 'Recipient Name',
              type: 'string'
            },
            {
              name: 'phone',
              title: 'Phone Number',
              type: 'string'
            },
            {
              name: 'streetLine1',
              title: 'Street Address Line 1',
              type: 'string'
            },
            {
              name: 'streetLine2',
              title: 'Street Address Line 2',
              type: 'string'
            },
            {
              name: 'city',
              title: 'City',
              type: 'string'
            },
            {
              name: 'stateRegion',
              title: 'State/Region',
              type: 'string'
            },
            {
              name: 'postalCode',
              title: 'Postal Code',
              type: 'string'
            },
            {
              name: 'countryCode',
              title: 'Country Code',
              type: 'string',
              description: 'ISO country code (e.g., US, CA, GB)'
            },
            {
              name: 'isDefault',
              title: 'Default Address',
              type: 'boolean',
              initialValue: false
            }
          ]
        }
      ]
    },
    {
      name: 'preferences',
      title: 'Preferences',
      type: 'object',
      fields: [
        {
          name: 'locale',
          title: 'Locale',
          type: 'string',
          initialValue: 'en-US'
        },
        {
          name: 'currency',
      title: 'Currency',
      type: 'string',
      initialValue: 'BDT'
        },
        {
          name: 'marketingOptIn',
          title: 'Marketing Emails',
          type: 'boolean',
          initialValue: false
        },
        {
          name: 'newsletterOptIn',
          title: 'Newsletter',
          type: 'boolean',
          initialValue: false
        },
        {
          name: 'productUpdatesOptIn',
          title: 'Product Updates',
          type: 'boolean',
          initialValue: false
        }
      ]
    },
    {
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      fields: [
        {
          name: 'facebook',
          title: 'Facebook',
          type: 'url'
        },
        {
          name: 'instagram',
          title: 'Instagram',
          type: 'url'
        },
        {
          name: 'twitter',
          title: 'Twitter',
          type: 'url'
        },
        {
          name: 'linkedin',
          title: 'LinkedIn',
          type: 'url'
        },
        {
          name: 'website',
          title: 'Website',
          type: 'url'
        }
      ]
    },
    {
      name: 'wishlist',
      title: 'Wishlist',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'product' }]
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
      name: 'updatedAt',
      title: 'Updated At',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    }
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'email',
      media: 'avatar'
    }
  }
}