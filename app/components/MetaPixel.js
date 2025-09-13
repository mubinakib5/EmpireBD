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

// Helper functions for tracking events
export const trackEvent = (eventName, parameters = {}, pixelId) => {
  if (typeof window !== 'undefined' && window.fbq && pixelId) {
    window.fbq('track', eventName, parameters);
  }
};

export const trackCustomEvent = (eventName, parameters = {}, pixelId) => {
  if (typeof window !== 'undefined' && window.fbq && pixelId) {
    window.fbq('trackCustom', eventName, parameters);
  }
};

// Specific e-commerce event helpers
export const trackPurchase = (value, currency = 'USD', contents = [], pixelId) => {
  trackEvent('Purchase', {
    value: value,
    currency: currency,
    contents: contents
  }, pixelId);
};

export const trackAddToCart = (contentId, contentName, value, currency = 'USD', pixelId) => {
  trackEvent('AddToCart', {
    content_ids: [contentId],
    content_name: contentName,
    content_type: 'product',
    value: value,
    currency: currency
  }, pixelId);
};

export const trackViewContent = (contentId, contentName, value, currency = 'USD', pixelId) => {
  trackEvent('ViewContent', {
    content_ids: [contentId],
    content_name: contentName,
    content_type: 'product',
    value: value,
    currency: currency
  }, pixelId);
};

export const trackInitiateCheckout = (value, currency = 'USD', contents = [], pixelId) => {
  trackEvent('InitiateCheckout', {
    value: value,
    currency: currency,
    contents: contents
  }, pixelId);
};

export const trackSearch = (searchString, pixelId) => {
  trackEvent('Search', {
    search_string: searchString
  }, pixelId);
};

export default MetaPixel;