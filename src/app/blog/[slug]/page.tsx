import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import StructuredData from "@/components/StructuredData";
import BlogPostTracker from "@/components/BlogPostTracker";
import { generateBreadcrumbSchema, generateArticleSchema } from "@/lib/structured-data";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all posts
export async function generateStaticParams() {
  const allPosts = getAllPosts();
  return allPosts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate metadata for each post
export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  
  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const baseUrl = "https://fastingclock.com";
  const postUrl = `${baseUrl}/blog/${slug}`;
  const postImage = post.image ? `${baseUrl}${post.image}` : `${baseUrl}/fastingclock-logo-adsense-5to1.png`;

  // Convert date to ISO format for publishedTime
  const publishedTime = new Date(post.date).toISOString();

  return {
    title: `${post.title} | FastingClock.com`,
    description: post.excerpt || post.description,
    alternates: {
      canonical: postUrl,
      languages: {
        "en": `${baseUrl}/en/blog/${slug}`,
        "es": `${baseUrl}/es/blog/${slug}`,
        "de": `${baseUrl}/de/blog/${slug}`,
        "fi": `${baseUrl}/fi/blog/${slug}`,
        "x-default": postUrl,
      },
    },
    openGraph: {
      title: `${post.title} | FastingClock.com`,
      description: post.excerpt || post.description,
      url: postUrl,
      type: "article",
      publishedTime: publishedTime,
      authors: [post.author || "Fasting Clock Team"],
      images: [
        {
          url: postImage,
          width: 1200,
          height: 240,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | FastingClock.com`,
      description: post.excerpt || post.description,
      images: {
        url: postImage,
        alt: post.title,
      },
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  // Generate structured data for this post
  const baseUrl = "https://fastingclock.com";
  const postUrl = `${baseUrl}/blog/${slug}`;
  const postImage = post.image ? `${baseUrl}${post.image}` : `${baseUrl}/fastingclock-logo-adsense-5to1.png`;

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://fastingclock.com" },
    { name: "Blog", url: "https://fastingclock.com/blog" },
    { name: post.title, url: postUrl }
  ]);

  const articleSchema = generateArticleSchema({
    headline: post.title,
    description: post.excerpt || post.description || post.title,
    image: postImage,
    author: "FastingClock Team",
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.date).toISOString(),
    canonicalUrl: postUrl
  });

  return (
    <>
      <StructuredData data={[breadcrumbSchema, articleSchema]} />
      <BlogPostTracker slug={slug} readTime={post.readTime} />
      <article className="max-w-3xl mx-auto">
      {/* Post Header */}
      <header className="mb-8">
        <div className="mb-4">
          <Link 
            href="/blog" 
            className="text-blue-400 hover:text-blue-300 text-sm font-medium"
          >
            ← Back to Blog
          </Link>
        </div>
        
        <h1 className="text-4xl font-bold mb-4 text-white">
          {post.title}
        </h1>
        
        <div className="flex items-center gap-4 text-gray-400 text-sm">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          {post.author && <span>By {post.author}</span>}
          {post.readTime && <span>{post.readTime}</span>}
        </div>
      </header>

      {/* Post Content */}
      <div 
        className="prose prose-invert prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.body }}
      />

      {/* Call-to-Action Section */}
      <section className="my-12 p-6 bg-blue-900 rounded-lg border border-blue-800">
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-3">Ready to Start Your Fasting Journey?</h3>
          <p className="text-blue-100 mb-4">
            Put what you&apos;ve learned into practice with our <Link href="/" className="text-yellow-400 hover:text-yellow-300 underline font-medium">free fasting timer</Link>. 
            Track your progress and stay motivated with our intuitive <Link href="/" className="text-yellow-400 hover:text-yellow-300 underline font-medium">fasting clock</Link>.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link 
              href="/" 
              className="inline-block bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold px-6 py-3 rounded-lg transition-colors"
            >
              Start Free Fasting Timer
            </Link>
            <Link 
              href="/blog" 
              className="inline-block bg-gray-700 hover:bg-gray-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Read More Fasting Tips
            </Link>
          </div>
        </div>
      </section>

      {/* Post Footer */}
      <footer className="mt-12 pt-8 border-t border-gray-700">
        <div className="text-center">
          <Link
            href="/blog"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            ← Back to All Posts
          </Link>
        </div>
      </footer>
    </article>
    </>
  );
}
