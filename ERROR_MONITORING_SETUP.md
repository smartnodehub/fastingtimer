# Error & Crash Monitoring with Sentry

This document describes the comprehensive error and crash monitoring implementation using Sentry for the FastingClock application.

## Overview

The error monitoring system captures:
- JavaScript errors and exceptions
- Unhandled promise rejections
- Resource loading errors
- React component errors (via Error Boundary)
- Performance data and user sessions
- Custom error reports and messages

## Setup Instructions

### 1. Sentry Project Setup

1. Create a Sentry account at [sentry.io](https://sentry.io)
2. Create a new project for your application
3. Choose "Next.js" as the platform
4. Note down your DSN (Data Source Name)

### 2. Environment Variables

Create a `.env.local` file in your project root:

```env
# Sentry Configuration
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
SENTRY_ORG=your-sentry-org
SENTRY_PROJECT=your-sentry-project
SENTRY_AUTH_TOKEN=your-sentry-auth-token
```

### 3. Getting Your Configuration Values

**DSN**: Found in your Sentry project settings under "Client Keys (DSN)"
**ORG**: Your Sentry organization slug
**PROJECT**: Your Sentry project slug  
**AUTH_TOKEN**: Create in Sentry Settings > Account > API > Auth Tokens

## Implementation Details

### Configuration Files

1. **`sentry.client.config.ts`** - Client-side error tracking
2. **`sentry.server.config.ts`** - Server-side error tracking  
3. **`sentry.edge.config.ts`** - Edge runtime error tracking

### Components

1. **`ErrorBoundary.tsx`** - Catches React component errors
2. **`ErrorReporter.tsx`** - Handles global errors and provides utilities

### Features Implemented

#### Error Boundary
- Catches React component errors
- Provides fallback UI with retry options
- Automatically reports errors to Sentry
- Shows error details in development mode

#### Global Error Handling
- Captures unhandled JavaScript errors
- Tracks unhandled promise rejections
- Monitors resource loading failures
- Adds contextual information to error reports

#### Performance Monitoring
- Tracks Core Web Vitals
- Monitors page load performance
- Captures user interactions
- Records network requests

#### Session Replay
- Records user sessions for debugging
- Captures 10% of normal sessions
- Captures 100% of error sessions
- Helps reproduce bugs

### Utility Functions

```typescript
import { reportError, addBreadcrumb, captureMessage } from '@/components/ErrorReporter';

// Manual error reporting
reportError(new Error('Custom error'), { context: 'additional data' });

// Add debugging breadcrumbs
addBreadcrumb('User clicked button', 'interaction', 'info');

// Capture informational messages
captureMessage('User completed action', 'info');
```

## Testing

Visit `/test-errors` in your application to test the error monitoring:

1. **JavaScript Error** - Tests error boundary and error reporting
2. **Async Error** - Tests unhandled promise rejection handling
3. **Manual Error** - Tests custom error reporting
4. **Resource Error** - Tests resource loading error capture
5. **Message Capture** - Tests custom message logging
6. **Breadcrumbs** - Tests user interaction tracking

## Monitoring Dashboard

In your Sentry dashboard, you can:

1. **View Errors** - See all captured errors with stack traces
2. **Performance** - Monitor page load times and web vitals
3. **Replays** - Watch user sessions that led to errors
4. **Releases** - Track errors across different deployments
5. **Alerts** - Set up notifications for critical errors

## Production Considerations

### Sample Rates
- Performance monitoring: 10% in production, 100% in development
- Session replay: 10% normal sessions, 100% error sessions
- Adjust based on your traffic and billing requirements

### Privacy
- Session replay masks sensitive data by default
- Consider additional masking for PII
- Review recorded sessions for compliance

### Performance Impact
- Sentry adds minimal overhead (~1-2ms per transaction)
- Source maps are uploaded for better debugging
- Error reports are sent asynchronously

## Filtering Errors

The configuration filters out common non-actionable errors:
- Chunk loading errors (often network-related)
- Script errors from third-party scripts
- Browser extension errors

You can customize filtering in the `beforeSend` hook in `sentry.client.config.ts`.

## Integration with Vercel

The setup includes automatic integration with Vercel:
- Automatic deployment tracking
- Cron monitor instrumentation
- Optimized for serverless environments

## Troubleshooting

### Common Issues

1. **No errors appearing in Sentry**
   - Check DSN is correct in environment variables
   - Verify network connectivity
   - Check browser console for Sentry initialization errors

2. **Source maps not working**
   - Ensure `SENTRY_AUTH_TOKEN` is set
   - Check organization and project names
   - Verify build process completes successfully

3. **Too many errors**
   - Adjust sample rates
   - Add more filters in `beforeSend`
   - Review error patterns for systemic issues

## Best Practices

1. **Use breadcrumbs** - Add context before errors occur
2. **Set user context** - Identify users when possible (with consent)
3. **Monitor performance** - Track Core Web Vitals alongside errors
4. **Regular review** - Check dashboard weekly for trends
5. **Alert setup** - Configure notifications for critical errors

## Security Notes

- Never include sensitive data in error reports
- Use environment variables for all configuration
- Consider data residency requirements for your region
- Review session recordings for sensitive information

## Next Steps

1. Set up alerts for critical errors
2. Configure integrations with your issue tracker
3. Set up release tracking for better debugging
4. Consider user feedback integration
5. Monitor and adjust sample rates based on usage

The error monitoring system is now fully integrated and will provide comprehensive insights into application stability and user experience.
