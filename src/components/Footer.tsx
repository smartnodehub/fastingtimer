// File: src/components/Footer.tsx
import Link from "next/link";
import Image from "next/image";
import { FC } from "react";

const Footer: FC = () => {
  return (
    <footer className="bg-gray-800 border-t border-gray-700 mt-16">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/fasting-clock-logo.svg"
                alt="Fasting Clock Logo"
                width={32}
                height={16}
                className="w-8 h-4"
              />
              <h3 className="text-xl font-bold text-white">FastingClock.com</h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Your free fasting timer and intermittent fasting companion. Track your fasting journey with our intuitive fasting clock and discover the benefits of time-restricted eating.
            </p>
            <p className="text-gray-500 text-xs">
              Start your intermittent fasting journey today with our completely free tools and expert guidance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                  Free Fasting Timer
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                  Fasting Blog
                </Link>
              </li>
              <li>
                <Link href="/blog/all" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                  All Articles
                </Link>
              </li>
              <li>
                <Link href="/blog/getting-started-16-8-intermittent-fasting" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                  Getting Started Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/blog/best-fasting-apps-2025" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                  Best Fasting Apps
                </Link>
              </li>
              <li>
                <Link href="/blog/5-tips-breaking-fast-properly" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                  Breaking Your Fast
                </Link>
              </li>
              <li>
                <a href="https://www.healthline.com/nutrition/intermittent-fasting-guide" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                  Healthline Fasting Guide
                </a>
              </li>
              <li>
                <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6627766/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                  Research on Fasting
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap gap-4 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-yellow-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-yellow-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-yellow-400 transition-colors">
                Contact
              </Link>
              <Link href="/sitemap.xml" className="text-gray-400 hover:text-yellow-400 transition-colors">
                Sitemap
              </Link>
            </div>
            <p className="text-gray-500 text-sm">
              © 2025 FastingClock.com - Free Fasting Timer & Clock
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
