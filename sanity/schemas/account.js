export default {
  name: 'account',
  title: 'Account',
  type: 'document',
  fields: [
    {
      name: 'userId',
      title: 'User ID',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'type',
      title: 'Account Type',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'provider',
      title: 'Provider',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'providerAccountId',
      title: 'Provider Account ID',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'refresh_token',
      title: 'Refresh Token',
      type: 'text'
    },
    {
      name: 'access_token',
      title: 'Access Token',
      type: 'text'
    },
    {
      name: 'expires_at',
      title: 'Expires At',
      type: 'number'
    },
    {
      name: 'token_type',
      title: 'Token Type',
      type: 'string'
    },
    {
      name: 'scope',
      title: 'Scope',
      type: 'string'
    },
    {
      name: 'id_token',
      title: 'ID Token',
      type: 'text'
    },
    {
      name: 'session_state',
      title: 'Session State',
      type: 'string'
    }
  ]
}