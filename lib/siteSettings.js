import { sanityClient } from './sanity';

// Fetch site settings from Sanity
export async function getSiteSettings() {
  try {
    const settings = await sanityClient.fetch(`
      *[_type == "siteSettings" && _id == "siteSettings"][0] {
        metaPixel {
          enabled,
          pixelId,
          testMode,
          trackPageViews,
          trackPurchases,
          trackAddToCart,
          trackViewContent
        },
        googleAnalytics {
          enabled,
          measurementId
        }
      }
    `);
    
    return settings || {
      metaPixel: {
        enabled: false,
        pixelId: null,
        testMode: false,
        trackPageViews: true,
        trackPurchases: true,
        trackAddToCart: true,
        trackViewContent: true
      },
      googleAnalytics: {
        enabled: false,
        measurementId: null
      }
    };
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return {
      metaPixel: {
        enabled: false,
        pixelId: null,
        testMode: false,
        trackPageViews: true,
        trackPurchases: true,
        trackAddToCart: true,
        trackViewContent: true
      },
      googleAnalytics: {
        enabled: false,
        measurementId: null
      }
    };
  }
}

// Get Meta Pixel configuration specifically
export async function getMetaPixelConfig() {
  const settings = await getSiteSettings();
  return settings.metaPixel;
}

// Get Google Analytics configuration specifically
export async function getGoogleAnalyticsConfig() {
  const settings = await getSiteSettings();
  return settings.googleAnalytics;
}