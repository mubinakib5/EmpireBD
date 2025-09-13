'use client';

import { createContext, useContext, useEffect, useState } from 'react';
// Import tracking functions dynamically to avoid SSR issues
let trackingFunctions = null;

const loadTrackingFunctions = async () => {
  if (typeof window !== 'undefined' && !trackingFunctions) {
    const metaPixelModule = await import('../components/MetaPixel');
    trackingFunctions = {
      trackEvent: metaPixelModule.trackEvent,
      trackCustomEvent: metaPixelModule.trackCustomEvent,
      trackPurchase: metaPixelModule.trackPurchase,
      trackAddToCart: metaPixelModule.trackAddToCart,
      trackViewContent: metaPixelModule.trackViewContent,
      trackInitiateCheckout: metaPixelModule.trackInitiateCheckout,
      trackSearch: metaPixelModule.trackSearch
    };
  }
  return trackingFunctions;
};

const MetaPixelContext = createContext();

export const useMetaPixel = () => {
  const context = useContext(MetaPixelContext);
  if (!context) {
    throw new Error('useMetaPixel must be used within a MetaPixelProvider');
  }
  return context;
};

export const MetaPixelProvider = ({ children, pixelConfig }) => {
  const [config, setConfig] = useState(pixelConfig);

  useEffect(() => {
    setConfig(pixelConfig);
  }, [pixelConfig]);

  const isEnabled = config?.enabled && config?.pixelId;

  const contextTrackingFunctions = {
    // Generic event tracking
    track: async (eventName, parameters = {}) => {
      if (isEnabled) {
        const functions = await loadTrackingFunctions();
        if (functions?.trackEvent) {
          functions.trackEvent(eventName, parameters, config.pixelId);
        }
      }
    },

    // Custom event tracking
    trackCustom: async (eventName, parameters = {}) => {
      if (isEnabled) {
        const functions = await loadTrackingFunctions();
        if (functions?.trackCustomEvent) {
          functions.trackCustomEvent(eventName, parameters, config.pixelId);
        }
      }
    },

    // E-commerce specific events
    trackPurchase: async (value, currency = 'USD', contents = []) => {
      if (isEnabled && config.trackPurchases) {
        const functions = await loadTrackingFunctions();
        if (functions?.trackPurchase) {
          functions.trackPurchase(value, currency, contents, config.pixelId);
        }
      }
    },

    trackAddToCart: async (contentId, contentName, value, currency = 'USD') => {
      if (isEnabled && config.trackAddToCart) {
        const functions = await loadTrackingFunctions();
        if (functions?.trackAddToCart) {
          functions.trackAddToCart(contentId, contentName, value, currency, config.pixelId);
        }
      }
    },

    trackViewContent: async (contentId, contentName, value, currency = 'USD') => {
      if (isEnabled && config.trackViewContent) {
        const functions = await loadTrackingFunctions();
        if (functions?.trackViewContent) {
          functions.trackViewContent(contentId, contentName, value, currency, config.pixelId);
        }
      }
    },

    trackInitiateCheckout: async (value, currency = 'USD', contents = []) => {
      if (isEnabled) {
        const functions = await loadTrackingFunctions();
        if (functions?.trackInitiateCheckout) {
          functions.trackInitiateCheckout(value, currency, contents, config.pixelId);
        }
      }
    },

    trackSearch: async (searchString) => {
      if (isEnabled) {
        const functions = await loadTrackingFunctions();
        if (functions?.trackSearch) {
          functions.trackSearch(searchString, config.pixelId);
        }
      }
    },

    // Utility functions
    isEnabled: () => isEnabled,
    getPixelId: () => config?.pixelId,
    getConfig: () => config
  };

  return (
    <MetaPixelContext.Provider value={contextTrackingFunctions}>
      {children}
    </MetaPixelContext.Provider>
  );
};

export default MetaPixelProvider;