// File: src/components/GoogleAnalytics.tsx
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { GA_MEASUREMENT_ID, pageview } from '@/lib/gtag';
import { reportWebVitals, reportDetailedWebVitals } from '@/lib/web-vitals';

export default function GoogleAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      pageview(pathname);
    }
  }, [pathname]);

  // Initialize Web Vitals reporting after GA4 is loaded
  useEffect(() => {
    // Wait a bit for GA4 to initialize
    const timer = setTimeout(() => {
      reportWebVitals();
      reportDetailedWebVitals();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Don't load analytics in development
  if (process.env.NODE_ENV === 'development') {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              anonymize_ip: true,
              allow_google_signals: false,
              allow_ad_personalization_signals: false,
            });
          `,
        }}
      />
    </>
  );
}
