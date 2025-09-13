'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  trackEvent, 
  trackCustomEvent, 
  trackPurchase, 
  trackAddToCart, 
  trackViewContent, 
  trackInitiateCheckout, 
  trackSearch 
} from '../components/MetaPixel';

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

  const trackingFunctions = {
    // Generic event tracking
    track: (eventName, parameters = {}) => {
      if (isEnabled) {
        trackEvent(eventName, parameters, config.pixelId);
      }
    },

    // Custom event tracking
    trackCustom: (eventName, parameters = {}) => {
      if (isEnabled) {
        trackCustomEvent(eventName, parameters, config.pixelId);
      }
    },

    // E-commerce specific events
    trackPurchase: (value, currency = 'USD', contents = []) => {
      if (isEnabled && config.trackPurchases) {
        trackPurchase(value, currency, contents, config.pixelId);
      }
    },

    trackAddToCart: (contentId, contentName, value, currency = 'USD') => {
      if (isEnabled && config.trackAddToCart) {
        trackAddToCart(contentId, contentName, value, currency, config.pixelId);
      }
    },

    trackViewContent: (contentId, contentName, value, currency = 'USD') => {
      if (isEnabled && config.trackViewContent) {
        trackViewContent(contentId, contentName, value, currency, config.pixelId);
      }
    },

    trackInitiateCheckout: (value, currency = 'USD', contents = []) => {
      if (isEnabled) {
        trackInitiateCheckout(value, currency, contents, config.pixelId);
      }
    },

    trackSearch: (searchString) => {
      if (isEnabled) {
        trackSearch(searchString, config.pixelId);
      }
    },

    // Utility functions
    isEnabled: () => isEnabled,
    getPixelId: () => config?.pixelId,
    getConfig: () => config
  };

  return (
    <MetaPixelContext.Provider value={trackingFunctions}>
      {children}
    </MetaPixelContext.Provider>
  );
};

export default MetaPixelProvider;