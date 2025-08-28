export default {
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string'
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: Rule => Rule.required().email()
    },
    {
      name: 'emailVerified',
      title: 'Email Verified',
      type: 'datetime'
    },
    {
      name: 'image',
      title: 'Image',
      type: 'url'
    },
    {
      name: 'password',
      title: 'Password Hash',
      type: 'string',
      description: 'Hashed password for credentials provider'
    },
    {
      name: 'provider',
      title: 'Primary Provider',
      type: 'string',
      options: {
        list: [
          { title: 'Credentials', value: 'credentials' },
          { title: 'Google', value: 'google' },
          { title: 'Facebook', value: 'facebook' },
          { title: 'GitHub', value: 'github' }
        ]
      },
      initialValue: 'credentials'
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
  ]
}