import axios from 'axios';

const API_BASE = '/api';

const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
};

const getSessionVisitorId = () => {
  if (typeof sessionStorage === 'undefined') return 'v-anon';
  let vId = sessionStorage.getItem('ceramic_visitor_session_id');
  if (!vId) {
    vId = 'v-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    sessionStorage.setItem('ceramic_visitor_session_id', vId);
    sessionStorage.setItem('is_new_visitor', 'true');
  }
  return vId;
};

// Send telemetry event silently
export const sendTelemetryEvent = async (type, payload = {}) => {
  try {
    const isNew = typeof sessionStorage !== 'undefined' && sessionStorage.getItem('is_new_visitor') === 'true';
    if (isNew && type === 'pageview') {
      sessionStorage.removeItem('is_new_visitor');
    }

    const eventData = {
      type,
      payload: {
        visitorId: getSessionVisitorId(),
        isNewVisitor: isNew && type === 'pageview',
        device: isMobileDevice() ? 'mobile' : 'desktop',
        timestamp: new Date().toISOString(),
        ...payload
      }
    };

    await axios.post(`${API_BASE}/analytics/track`, eventData);
  } catch (err) {
    // Silent fail for telemetry
  }
};

// Track WhatsApp Click
export const trackWhatsAppClick = (source = 'general') => {
  sendTelemetryEvent('whatsapp_click', { source });
};

// Track Product View
export const trackProductView = (productId) => {
  if (productId) {
    sendTelemetryEvent('product_view', { productId });
  }
};

// Track Search Term
export const trackSearchQuery = (query) => {
  if (query && query.trim().length >= 2) {
    sendTelemetryEvent('search', { query: query.trim() });
  }
};

// Initialize Analytics & Heartbeat Timer
export const initAnalyticsTracker = () => {
  if (typeof window === 'undefined') return;

  // Track initial pageview
  sendTelemetryEvent('pageview');

  // Heartbeat ping every 30 seconds for browsing duration
  const intervalId = setInterval(() => {
    sendTelemetryEvent('heartbeat', { seconds: 30 });
  }, 30000);

  return () => clearInterval(intervalId);
};
