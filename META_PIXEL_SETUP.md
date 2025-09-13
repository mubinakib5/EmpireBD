# Meta Pixel Integration with Sanity CMS

This guide explains how to set up and use Meta Pixel tracking in your Next.js application with Sanity CMS.

## Overview

The Meta Pixel integration allows you to:
- Manage Meta Pixel settings through Sanity CMS
- Track e-commerce events (purchases, add to cart, view content)
- Enable/disable tracking without code changes
- Use test mode for debugging

## Setup Instructions

### 1. Configure Meta Pixel in Sanity Studio

1. Go to your Sanity Studio at `/studio`
2. Navigate to "Site Settings" in the sidebar
3. Configure your Meta Pixel settings:
   - **Enable Meta Pixel**: Toggle to activate tracking
   - **Meta Pixel ID**: Your 15-16 digit Facebook Pixel ID
   - **Test Mode**: Enable for debugging (events marked as test)
   - **Track Page Views**: Automatically track page views
   - **Track Purchases**: Track purchase events
   - **Track Add to Cart**: Track add to cart events
   - **Track View Content**: Track product page views

### 2. Get Your Meta Pixel ID

1. Go to [Facebook Events Manager](https://business.facebook.com/events_manager)
2. Select your pixel or create a new one
3. Copy the Pixel ID (15-16 digits)
4. Paste it into the Sanity Studio Site Settings

## Available Tracking Events

The integration automatically tracks the following events:

### Automatic Events
- **PageView**: Tracked on every page load
- **ViewContent**: Tracked when viewing product pages
- **AddToCart**: Tracked when adding items to cart

### Manual Events (via useMetaPixel hook)

```javascript
import { useMetaPixel } from '../context/MetaPixelContext';

function MyComponent() {
  const { 
    track, 
    trackCustom, 
    trackPurchase, 
    trackInitiateCheckout, 
    trackSearch 
  } = useMetaPixel();

  // Track a standard event
  const handlePurchase = () => {
    trackPurchase(99.99, 'USD', [
      {
        id: 'product-123',
        quantity: 1,
        item_price: 99.99
      }
    ]);
  };

  // Track a custom event
  const handleCustomEvent = () => {
    trackCustom('Newsletter_Signup', {
      source: 'homepage'
    });
  };

  // Track search
  const handleSearch = (query) => {
    trackSearch(query);
  };

  // Track checkout initiation
  const handleCheckout = (cartValue, items) => {
    trackInitiateCheckout(cartValue, 'USD', items);
  };
}
```

## Implementation Details

### Files Created/Modified

1. **Sanity Schema**: `sanity/schemas/siteSettings.js`
   - Defines the Meta Pixel configuration structure

2. **Meta Pixel Component**: `app/components/MetaPixel.js`
   - Handles the Facebook Pixel script loading
   - Provides tracking helper functions

3. **Meta Pixel Context**: `app/context/MetaPixelContext.js`
   - React context for accessing tracking functions
   - Handles configuration and enabled state

4. **Site Settings Utility**: `lib/siteSettings.js`
   - Fetches configuration from Sanity

5. **Layout Integration**: `app/layout.js`
   - Loads Meta Pixel script site-wide
   - Provides context to all components

### Usage Examples

#### Tracking Purchase Events
```javascript
// In your checkout success page
import { useMetaPixel } from '../context/MetaPixelContext';

function CheckoutSuccess({ order }) {
  const { trackPurchase } = useMetaPixel();

  useEffect(() => {
    if (order) {
      trackPurchase(
        order.total,
        order.currency,
        order.items.map(item => ({
          id: item.productId,
          quantity: item.quantity,
          item_price: item.price
        }))
      );
    }
  }, [order, trackPurchase]);

  return <div>Thank you for your purchase!</div>;
}
```

#### Tracking Search Events
```javascript
// In your search component
import { useMetaPixel } from '../context/MetaPixelContext';

function SearchBar() {
  const { trackSearch } = useMetaPixel();
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      trackSearch(query);
      // Perform search...
    }
  };

  return (
    <form onSubmit={handleSearch}>
      <input 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
      />
      <button type="submit">Search</button>
    </form>
  );
}
```

## Testing

### Test Mode
1. Enable "Test Mode" in Sanity Studio
2. Events will be marked with `test_event_code: 'TEST12345'`
3. Use Facebook's Test Events tool to verify tracking

### Facebook Test Events Tool
1. Go to Events Manager > Test Events
2. Enter your Pixel ID
3. Browse your website to see events in real-time

## Troubleshooting

### Common Issues

1. **Events not showing in Facebook**
   - Check if Meta Pixel is enabled in Sanity
   - Verify Pixel ID is correct (15-16 digits)
   - Check browser console for errors

2. **Tracking not working**
   - Ensure `useMetaPixel` is used within `MetaPixelProvider`
   - Check if ad blockers are interfering
   - Verify network requests to `facebook.net`

3. **Test events not appearing**
   - Enable Test Mode in Sanity Studio
   - Use Facebook's Test Events tool
   - Check browser developer tools for network requests

### Debug Mode
Enable debug mode by setting `testMode: true` in Sanity Studio. This will:
- Log events to browser console
- Mark events as test events in Facebook
- Provide additional debugging information

## Security Notes

- Meta Pixel ID is safe to expose publicly
- No sensitive data should be sent in tracking events
- Always validate and sanitize event parameters
- Consider GDPR compliance for EU users

## Next Steps

1. Set up Facebook Conversions API for server-side tracking
2. Implement custom audiences based on tracked events
3. Create Facebook ad campaigns using tracked data
4. Set up attribution and conversion tracking

For more information, visit the [Facebook Pixel documentation](https://developers.facebook.com/docs/facebook-pixel/).