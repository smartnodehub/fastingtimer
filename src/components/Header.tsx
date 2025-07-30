// File: src/components/Header.tsx
import Link from "next/link";
import Image from "next/image";
import { FC } from "react";

const Header: FC = () => {
  return (
    <header className="bg-blue-900 border-b border-blue-800">
      <div className="container mx-auto px-4 py-8">
        {/* Centered Logo Section */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block group">
            {/* Large centered logo */}
            <div className="flex flex-col items-center gap-4">
              <Image
                src="/fasting-clock-logo.svg"
                alt="Fasting Clock Logo"
                width={224}
                height={112}
                priority={true}
                className="w-32 h-16 sm:w-40 sm:h-20 md:w-48 md:h-24 lg:w-56 lg:h-28 transition-transform group-hover:scale-105"
              />
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white group-hover:text-yellow-400 transition-colors">
                Fasting Clock
              </h1>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex items-center justify-center space-x-2 md:space-x-4">
          <Link 
            href="/" 
            className="text-blue-200 hover:text-yellow-400 transition-colors text-sm md:text-lg font-medium px-3 md:px-6 py-2 rounded-lg hover:bg-blue-800"
          >
            Free Fasting Timer
          </Link>
          <Link 
            href="/blog" 
            className="text-blue-200 hover:text-yellow-400 transition-colors text-sm md:text-lg font-medium px-3 md:px-6 py-2 rounded-lg hover:bg-blue-800"
          >
            Blog
          </Link>
          <Link 
            href="/blog/all" 
            className="text-blue-200 hover:text-yellow-400 transition-colors text-sm md:text-lg font-medium px-3 md:px-6 py-2 rounded-lg hover:bg-blue-800"
          >
            All Posts
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
