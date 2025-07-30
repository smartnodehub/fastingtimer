// File: src/components/WebVitalsReporter.tsx
'use client';

import { useEffect } from 'react';
import { reportWebVitals, reportDetailedWebVitals } from '@/lib/web-vitals';

export default function WebVitalsReporter() {
  useEffect(() => {
    // Ensure we're in the browser and GA4 is available
    if (typeof window === 'undefined') return;

    // Wait for GA4 to initialize before reporting metrics
    const initTimer = setTimeout(() => {
      if (window.gtag) {
        reportWebVitals();
        reportDetailedWebVitals();
      } else {
        // If GA4 isn't ready yet, wait a bit longer
        setTimeout(() => {
          reportWebVitals();
          reportDetailedWebVitals();
        }, 2000);
      }
    }, 500);

    return () => clearTimeout(initTimer);
  }, []);

  // Report Web Vitals on page visibility change (for better accuracy)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Report final metrics when user leaves the page
        reportWebVitals();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return null; // This component doesn't render anything
}
