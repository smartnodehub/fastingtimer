// File: src/components/BlogPostTracker.tsx
'use client';

import { useEffect } from 'react';
import { trackBlogPostRead } from '@/lib/gtag';

interface BlogPostTrackerProps {
  slug: string;
  readTime?: string;
}

export default function BlogPostTracker({ slug, readTime }: BlogPostTrackerProps) {
  useEffect(() => {
    // Track blog post view on component mount
    trackBlogPostRead(slug, readTime || '');
  }, [slug, readTime]);

  return null; // This component doesn't render anything
}
