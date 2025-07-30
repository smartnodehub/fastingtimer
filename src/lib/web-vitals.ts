// File: src/lib/web-vitals.ts
import { onCLS, onFCP, onLCP, onTTFB, onINP, type Metric } from 'web-vitals';
import { event } from './gtag';

// Core Web Vitals thresholds (as per Google recommendations)
const THRESHOLDS = {
  LCP: { good: 2500, needsImprovement: 4000 },
  CLS: { good: 0.1, needsImprovement: 0.25 },
  FCP: { good: 1800, needsImprovement: 3000 },
  TTFB: { good: 800, needsImprovement: 1800 },
  INP: { good: 200, needsImprovement: 500 },
};

// Helper function to get performance rating
function getPerformanceRating(value: number, metric: keyof typeof THRESHOLDS): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[metric];
  if (value <= threshold.good) return 'good';
  if (value <= threshold.needsImprovement) return 'needs-improvement';
  return 'poor';
}

// Helper function to get device type
function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  const userAgent = navigator.userAgent.toLowerCase();
  if (/mobile|android|iphone|ipod|phone/i.test(userAgent)) return 'mobile';
  if (/tablet|ipad/i.test(userAgent)) return 'tablet';
  return 'desktop';
}

// Helper function to get connection type
function getConnectionType(): string {
  const connection = (navigator as unknown as { connection?: { effectiveType?: string } }).connection;
  return connection?.effectiveType || 'unknown';
}

// Report Core Web Vitals to GA4
export function reportWebVitals() {
  // Only run in browser environment
  if (typeof window === 'undefined') return;

  const deviceType = getDeviceType();
  const connectionType = getConnectionType();

  // Largest Contentful Paint (LCP) - Loading performance
  onLCP((metric: Metric) => {
    const rating = getPerformanceRating(metric.value, 'LCP');
    
    event('web_vitals_lcp', {
      event_category: 'Core Web Vitals',
      event_label: `LCP-${rating}`,
      value: Math.round(metric.value),
      metric_name: 'LCP',
      metric_value: Math.round(metric.value),
      metric_rating: rating,
      metric_id: metric.id,
      device_type: deviceType,
      connection_type: connectionType,
    });
  });

  // Cumulative Layout Shift (CLS) - Visual stability
  onCLS((metric: Metric) => {
    const rating = getPerformanceRating(metric.value, 'CLS');
    
    event('web_vitals_cls', {
      event_category: 'Core Web Vitals',
      event_label: `CLS-${rating}`,
      value: Math.round(metric.value * 1000), // Multiply by 1000 for GA4 (which expects integers)
      metric_name: 'CLS',
      metric_value: Math.round(metric.value * 1000),
      metric_rating: rating,
      metric_id: metric.id,
      device_type: deviceType,
      connection_type: connectionType,
    });
  });

  // First Contentful Paint (FCP) - Loading performance
  onFCP((metric: Metric) => {
    const rating = getPerformanceRating(metric.value, 'FCP');
    
    event('web_vitals_fcp', {
      event_category: 'Core Web Vitals',
      event_label: `FCP-${rating}`,
      value: Math.round(metric.value),
      metric_name: 'FCP',
      metric_value: Math.round(metric.value),
      metric_rating: rating,
      metric_id: metric.id,
      device_type: deviceType,
      connection_type: connectionType,
    });
  });

  // Time to First Byte (TTFB) - Server response time
  onTTFB((metric: Metric) => {
    const rating = getPerformanceRating(metric.value, 'TTFB');
    
    event('web_vitals_ttfb', {
      event_category: 'Core Web Vitals',
      event_label: `TTFB-${rating}`,
      value: Math.round(metric.value),
      metric_name: 'TTFB',
      metric_value: Math.round(metric.value),
      metric_rating: rating,
      metric_id: metric.id,
      device_type: deviceType,
      connection_type: connectionType,
    });
  });

  // Interaction to Next Paint (INP) - Responsiveness (replaces FID)
  onINP((metric: Metric) => {
    const rating = getPerformanceRating(metric.value, 'INP');
    
    event('web_vitals_inp', {
      event_category: 'Core Web Vitals',
      event_label: `INP-${rating}`,
      value: Math.round(metric.value),
      metric_name: 'INP',
      metric_value: Math.round(metric.value),
      metric_rating: rating,
      metric_id: metric.id,
      device_type: deviceType,
      connection_type: connectionType,
    });
  });
}

// Advanced Web Vitals reporting with additional context
export function reportDetailedWebVitals() {
  if (typeof window === 'undefined') return;

  // Report page context for better analysis
  const pageContext = {
    page_path: window.location.pathname,
    page_url: window.location.href,
    referrer: document.referrer || 'direct',
    viewport_width: window.innerWidth,
    viewport_height: window.innerHeight,
    device_pixel_ratio: window.devicePixelRatio || 1,
  };

  // Enhanced LCP reporting with element details
  onLCP((metric: Metric) => {
    const rating = getPerformanceRating(metric.value, 'LCP');
    
    // Get LCP element information if available
    const lcpElement = (metric as unknown as { entries?: Array<{ element?: Element }> }).entries?.[metric.entries?.length - 1]?.element;
    const elementInfo = lcpElement ? {
      lcp_element_tag: lcpElement.tagName?.toLowerCase(),
      lcp_element_id: lcpElement.id || 'no-id',
      lcp_element_class: lcpElement.className || 'no-class',
    } : {};

    event('web_vitals_lcp_detailed', {
      event_category: 'Core Web Vitals Detailed',
      event_label: `LCP-${rating}-${metric.value.toFixed(0)}ms`,
      value: Math.round(metric.value),
      metric_name: 'LCP',
      metric_value: Math.round(metric.value),
      metric_rating: rating,
      ...pageContext,
      ...elementInfo,
    });
  });

  // Enhanced CLS reporting with shift sources
  onCLS((metric: Metric) => {
    const rating = getPerformanceRating(metric.value, 'CLS');
    
    event('web_vitals_cls_detailed', {
      event_category: 'Core Web Vitals Detailed',
      event_label: `CLS-${rating}-${(metric.value * 1000).toFixed(0)}`,
      value: Math.round(metric.value * 1000),
      metric_name: 'CLS',
      metric_value: Math.round(metric.value * 1000),
      metric_rating: rating,
      layout_shift_count: metric.entries?.length || 0,
      ...pageContext,
    });
  });
}
