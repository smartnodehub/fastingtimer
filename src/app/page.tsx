// File: src/app/page.tsx
import Link from "next/link";
import { Suspense, lazy } from "react";
import Header        from "@/components/Header";
import IntroSection  from "@/components/IntroSection";
import TimerForm     from "@/components/TimerForm";
import ResourceLinks from "@/components/ResourceLinks";
import StructuredData from "@/components/StructuredData";
import { content }   from "@/content/content.en";
import { 
  generateBreadcrumbSchema, 
  generateWebsiteSchema, 
  generateOrganizationSchema,
  generateFAQSchema 
} from "@/lib/structured-data";

// Lazy load below-the-fold components
const BenefitList = lazy(() => import("@/components/BenefitList"));
const FAQ = lazy(() => import("@/components/FAQ"));

export const metadata = {
  title:       "Free Fasting Timer & Clock | FastingClock.com",
  description: "Track your intermittent fasting with our free fasting timer and intuitive fasting clock. Stay motivated, reach your goals, and start your journey today!",
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
    title: "Free Fasting Timer & Clock | FastingClock.com",
    description: "Track your intermittent fasting with our free fasting timer and intuitive fasting clock. Stay motivated, reach your goals, and start your journey today!",
    url: "https://fastingclock.com",
    type: "website",
    images: [
      {
        url: "https://fastingclock.com/fastingclock-logo-adsense-5to1.png",
        width: 1200,
        height: 240,
        alt: "Free Fasting Timer & Clock - FastingClock.com",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Fasting Timer & Clock | FastingClock.com",
    description: "Track your intermittent fasting with our free fasting timer and intuitive fasting clock. Stay motivated, reach your goals, and start your journey today!",
    images: {
      url: "https://fastingclock.com/fastingclock-logo-adsense-5to1.png",
      alt: "Free Fasting Timer & Clock - FastingClock.com",
    },
  },
};

// Generate structured data for homepage
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://fastingclock.com" }
]);

const websiteSchema = generateWebsiteSchema();
const organizationSchema = generateOrganizationSchema();
const faqSchema = generateFAQSchema(content.faqItems);

export default function HomePage() {
  return (
    <>
      <StructuredData data={[breadcrumbSchema, websiteSchema, organizationSchema, faqSchema]} />
      <main className="bg-gray-900 text-white">
        <Header />
        <TimerForm />
        <ResourceLinks />
        
        {/* Call-to-Action Section */}
        <section className="py-8 px-4 bg-blue-900 text-center">
          <h2 className="text-2xl font-bold mb-4">Master Intermittent Fasting with Expert Guidance</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Explore our comprehensive collection of <Link href="/blog" className="text-yellow-400 hover:text-yellow-300 underline">intermittent fasting guides</Link> and expert tips. 
            Learn everything from <Link href="/blog/getting-started-16-8-intermittent-fasting" className="text-yellow-400 hover:text-yellow-300 underline">16:8 fasting basics</Link> to 
            advanced strategies with our <Link href="/blog/best-fasting-apps-2025" className="text-yellow-400 hover:text-yellow-300 underline">recommended fasting apps</Link>.
          </p>
          <Link 
            href="/blog" 
            className="inline-block bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold px-6 py-3 rounded-lg transition-colors"
          >
            Explore Fasting Tips & Guides
          </Link>
        </section>
        
        <IntroSection text={content.intro16to8} />
        <Suspense fallback={<div className="py-8 text-center text-gray-400">Loading benefits...</div>}>
          <BenefitList items={content.benefits} />
        </Suspense>
        <Suspense fallback={<div className="py-8 text-center text-gray-400">Loading FAQ...</div>}>
          <FAQ items={content.faqItems} />
        </Suspense>
      </main>
    </>
  );
}
