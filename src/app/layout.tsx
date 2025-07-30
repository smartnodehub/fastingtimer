import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import WebVitalsReporter from "@/components/WebVitalsReporter";
import ErrorBoundary from "@/components/ErrorBoundary";
import ErrorReporter from "@/components/ErrorReporter";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Free Fasting Timer & Tracker | FastingClock.com",
  description: "Easily track your fasting with our free fasting timer and sleek fasting clock. Stay on schedule, improve health, and never miss a window—start tracking today!",
  verification: {
    google: "JX76zFCjhtttG2yEJ7AyLaHu-nLIN5oRB_KSSPQQlxc",
  },
  alternates: {
    canonical: "https://fastingclock.com",
    languages: {
      "en": "https://fastingclock.com/en",
      "es": "https://fastingclock.com/es",
      "de": "https://fastingclock.com/de",
      "fi": "https://fastingclock.com/fi",
      "x-default": "https://fastingclock.com",
    },
  },
  openGraph: {
    title: "Free Fasting Timer & Tracker | FastingClock.com",
    description: "Easily track your fasting with our free fasting timer and sleek fasting clock. Stay on schedule, improve health, and never miss a window—start tracking today!",
    url: "https://fastingclock.com",
    type: "website",
    images: [
      {
        url: "https://fastingclock.com/fastingclock-logo-adsense-5to1.png",
        width: 1200,
        height: 240,
        alt: "Free Fasting Timer & Tracker - FastingClock.com",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Fasting Timer & Tracker | FastingClock.com",
    description: "Easily track your fasting with our free fasting timer and sleek fasting clock. Stay on schedule, improve health, and never miss a window—start tracking today!",
    images: {
      url: "https://fastingclock.com/fastingclock-logo-adsense-5to1.png",
      alt: "Free Fasting Timer & Tracker - FastingClock.com",
    },
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preload critical assets for LCP */}
        <link 
          rel="preload" 
          href="/fasting-clock-logo.svg" 
          as="image" 
          type="image/svg+xml"
        />
        <link 
          rel="preload" 
          href="https://fastingclock.com/fastingclock-logo-adsense-5to1.png" 
          as="image" 
          type="image/png"
        />
        {/* Preload critical fonts */}
        <link 
          rel="preload" 
          href="/_next/static/css/app/globals.css"
          as="style"
        />
        {/* AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7058115116105378"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <GoogleAnalytics />
          <WebVitalsReporter />
          <ErrorReporter />
          {children}
          <Footer />
        </ErrorBoundary>
      </body>
    </html>
  );
}
