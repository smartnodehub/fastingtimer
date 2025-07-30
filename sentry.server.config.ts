import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Set tracesSampleRate to 1.0 to capture 100%
  // of the transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // You can remove this option if you're not planning to use the Sentry webpack plugin for uploading source maps.
  debug: process.env.NODE_ENV === 'development',
  
  integrations: [
    // Server-side integrations will be automatically included
  ],
  
  // Set tags for better organization
  initialScope: {
    tags: {
      component: 'server',
      environment: process.env.NODE_ENV,
    },
  },
});
