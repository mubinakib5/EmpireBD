'use client';

import { useEffect } from 'react';
import Script from 'next/script';

const MetaPixel = ({ pixelId, testMode = false }) => {
  useEffect(() => {
    if (!pixelId) return;

    // Initialize Meta Pixel
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('init', pixelId, {
        debug: testMode,
        test_event_code: testMode ? 'TEST12345' : undefined
      });
      window.fbq('track', 'PageView');
    }
  }, [pixelId, testMode]);

  if (!pixelId) return null;

  return (
    <>
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelId}', {
              debug: ${testMode},
              ${testMode ? "test_event_code: 'TEST12345'" : ''}
            });
            fbq('track', 'PageView');
          `
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt="Meta Pixel"
        />
      </noscript>
    </>
  );
};

// Helper function to track events with both Pixel and Conversions API
export const trackEvent = async (eventName, eventData = {}, userData = {}) => {
  try {
    // Track with Meta Pixel (client-side)
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', eventName, eventData);
    }
    
    // Also send to Conversions API (server-side) for better data quality
    const response = await fetch('/api/facebook-conversions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventName,
        eventData: {
          ...eventData,
          event_source_url: window.location.href
        },
        userData
      })
    });
    
    if (!response.ok) {
      console.warn('Failed to send event to Conversions API:', await response.text());
    }
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};

// Enhanced tracking functions that use both Pixel and Conversions API
export const trackViewContent = async (contentData) => {
  await trackEvent('ViewContent', {
    content_type: 'product',
    content_ids: [contentData.content_id || contentData.id],
    content_name: contentData.content_name || contentData.name,
    content_category: contentData.content_category || contentData.category,
    value: contentData.value || contentData.price,
    currency: 'BDT'
  });
};

export const trackAddToCart = async (cartData) => {
  await trackEvent('AddToCart', {
    content_type: 'product',
    content_ids: [cartData.content_id || cartData.id],
    content_name: cartData.content_name || cartData.name,
    content_category: cartData.content_category || cartData.category,
    value: cartData.value || cartData.price,
    currency: 'BDT'
  });
};

export const trackPurchase = async (purchaseData) => {
  await trackEvent('Purchase', {
    content_type: 'product',
    content_ids: purchaseData.content_ids || [purchaseData.id],
    value: purchaseData.value || purchaseData.total,
    currency: 'BDT',
    num_items: purchaseData.num_items || 1
  });
};

export const trackInitiateCheckout = async (checkoutData) => {
  await trackEvent('InitiateCheckout', {
    content_type: 'product',
    content_ids: checkoutData.content_ids || [checkoutData.id],
    value: checkoutData.value || checkoutData.total,
    currency: 'BDT',
    num_items: checkoutData.num_items || 1
  });
};

export const trackSearch = (searchString, pixelId) => {
  trackEvent('Search', {
    search_string: searchString
  }, pixelId);
};

export default MetaPixel;