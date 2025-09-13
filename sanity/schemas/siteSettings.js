export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  __experimental_actions: [
    // Disable create and delete actions for singleton
    'update',
    'publish'
  ],
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Site Settings',
      readOnly: true,
      hidden: true
    },
    {
      name: 'metaPixel',
      title: 'Meta Pixel Configuration',
      type: 'object',
      fields: [
        {
          name: 'enabled',
          title: 'Enable Meta Pixel',
          type: 'boolean',
          description: 'Toggle to enable or disable Meta Pixel tracking',
          initialValue: false
        },
        {
          name: 'pixelId',
          title: 'Meta Pixel ID',
          type: 'string',
          description: 'Your Meta Pixel ID (e.g., 123456789012345)',
          validation: Rule => Rule.custom(value => {
            if (!value) return true; // Allow empty if pixel is disabled
            if (!/^\d{15,16}$/.test(value)) {
              return 'Meta Pixel ID should be 15-16 digits';
            }
            return true;
          })
        },
        {
          name: 'testMode',
          title: 'Test Mode',
          type: 'boolean',
          description: 'Enable test mode for debugging (events will be marked as test events)',
          initialValue: false
        },
        {
          name: 'trackPageViews',
          title: 'Track Page Views',
          type: 'boolean',
          description: 'Automatically track page views',
          initialValue: true
        },
        {
          name: 'trackPurchases',
          title: 'Track Purchases',
          type: 'boolean',
          description: 'Track purchase events in checkout',
          initialValue: true
        },
        {
          name: 'trackAddToCart',
          title: 'Track Add to Cart',
          type: 'boolean',
          description: 'Track when users add items to cart',
          initialValue: true
        },
        {
          name: 'trackViewContent',
          title: 'Track View Content',
          type: 'boolean',
          description: 'Track when users view product pages',
          initialValue: true
        }
      ]
    },
    {
      name: 'googleAnalytics',
      title: 'Google Analytics',
      type: 'object',
      fields: [
        {
          name: 'enabled',
          title: 'Enable Google Analytics',
          type: 'boolean',
          initialValue: false
        },
        {
          name: 'measurementId',
          title: 'GA4 Measurement ID',
          type: 'string',
          description: 'Your GA4 Measurement ID (e.g., G-XXXXXXXXXX)'
        }
      ]
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Site Settings'
      };
    }
  }
};