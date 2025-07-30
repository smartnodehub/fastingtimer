'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/react';

export default function ErrorReporter() {
  useEffect(() => {
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      Sentry.captureException(event.reason, {
        tags: {
          source: 'unhandledRejection',
        },
        extra: {
          promise: event.promise,
        },
      });
    };

    // Handle global JavaScript errors
    const handleError = (event: ErrorEvent) => {
      console.error('Global error:', event.error);
      
      Sentry.captureException(event.error, {
        tags: {
          source: 'globalError',
        },
        extra: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          message: event.message,
        },
      });
    };

    // Handle resource loading errors
    const handleResourceError = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target && target.tagName) {
        const error = new Error(`Resource failed to load: ${target.tagName} ${target.getAttribute('src') || target.getAttribute('href') || ''}`);
        
        Sentry.captureException(error, {
          tags: {
            source: 'resourceError',
            element: target.tagName.toLowerCase(),
          },
          extra: {
            src: target.getAttribute('src'),
            href: target.getAttribute('href'),
            outerHTML: target.outerHTML,
          },
        });
      }
    };

    // Add event listeners
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);
    window.addEventListener('error', handleResourceError, true); // Capture phase for resource errors

    // Cleanup function
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
      window.removeEventListener('error', handleResourceError, true);
    };
  }, []);

  // This component doesn't render anything
  return null;
}

// Utility function to manually report errors
export const reportError = (error: Error, context?: Record<string, unknown>) => {
  console.error('Manual error report:', error);
  
  Sentry.captureException(error, {
    tags: {
      source: 'manual',
    },
    extra: context,
  });
};

// Utility function to add breadcrumbs for debugging
export const addBreadcrumb = (message: string, category?: string, level?: 'info' | 'warning' | 'error' | 'debug') => {
  Sentry.addBreadcrumb({
    message,
    category: category || 'custom',
    level: level || 'info',
    timestamp: Date.now() / 1000,
  });
};

// Utility function to set user context
export const setUserContext = (user: { id?: string; email?: string; username?: string }) => {
  Sentry.setUser(user);
};

// Utility function to set additional context
export const setExtraContext = (key: string, value: unknown) => {
  Sentry.setExtra(key, value);
};

// Utility function to capture a message
export const captureMessage = (message: string, level?: 'info' | 'warning' | 'error' | 'debug') => {
  Sentry.captureMessage(message, level || 'info');
};
