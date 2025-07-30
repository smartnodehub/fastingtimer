import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Set tracesSampleRate to 1.0 to capture 100%
  // of the transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Capture Replay for 10% of all sessions,
  // plus for 100% of sessions with an error
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  
  // You can remove this option if you're not planning to use the Sentry webpack plugin for uploading source maps.
  debug: process.env.NODE_ENV === 'development',
  
  integrations: [
    Sentry.replayIntegration({
      // Additional SDK configuration goes in here, for example:
      maskAllText: false,
      blockAllMedia: false,
    }),
    // Web Vitals integration
    Sentry.browserTracingIntegration({
      // Tracing configuration removed - not supported in this SDK version
    }),
  ],
  
  // Performance Monitoring
  beforeSend(event) {
    // Filter out certain errors in production
    if (process.env.NODE_ENV === 'production') {
      // Filter out non-actionable errors
      if (event.exception) {
        const error = event.exception.values?.[0];
        if (error?.type === 'ChunkLoadError' || 
            error?.value?.includes('Loading chunk') ||
            error?.value?.includes('Script error')) {
          return null;
        }
      }
    }
    return event;
  },
  
  // Set tags for better organization
  initialScope: {
    tags: {
      component: 'client',
      environment: process.env.NODE_ENV,
    },
  },
});
