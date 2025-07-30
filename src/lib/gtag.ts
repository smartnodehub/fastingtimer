// File: src/lib/gtag.ts
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';

// Pageview tracking
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Event tracking with enhanced ecommerce support
export const event = (action: string, {
  event_category,
  event_label,
  value,
  user_engagement,
  ...parameters
}: {
  event_category?: string;
  event_label?: string;
  value?: number;
  user_engagement?: 'timer_interaction' | 'content_engagement' | 'navigation';
  [key: string]: string | number | boolean | undefined;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category,
      event_label,
      value,
      user_engagement,
      ...parameters,
    });
  }
};

// Custom events for FastingClock app
export const trackTimerStart = (method: string, duration: number) => {
  event('timer_started', {
    event_category: 'fasting_timer',
    event_label: method,
    value: duration,
    user_engagement: 'timer_interaction',
    fasting_method: method,
    timer_duration_hours: duration,
  });
};

export const trackTimerComplete = (method: string, duration: number) => {
  event('timer_completed', {
    event_category: 'fasting_timer',
    event_label: method,
    value: duration,
    user_engagement: 'timer_interaction',
    fasting_method: method,
    timer_duration_hours: duration,
  });
};

export const trackFAQExpansion = (question: string, index: number) => {
  event('faq_expanded', {
    event_category: 'content_engagement',
    event_label: question,
    value: index,
    user_engagement: 'content_engagement',
    faq_question: question.substring(0, 100), // Truncate for GA
    faq_position: index,
  });
};

export const trackBlogPostRead = (slug: string, readTime: string) => {
  event('blog_post_viewed', {
    event_category: 'content_engagement',
    event_label: slug,
    user_engagement: 'content_engagement',
    blog_slug: slug,
    estimated_read_time: readTime,
  });
};

export const trackMethodSelection = (method: string) => {
  event('fasting_method_selected', {
    event_category: 'fasting_timer',
    event_label: method,
    user_engagement: 'timer_interaction',
    selected_method: method,
  });
};

export const trackResourceClick = (resource: string, href: string) => {
  event('resource_clicked', {
    event_category: 'navigation',
    event_label: resource,
    user_engagement: 'navigation',
    resource_name: resource,
    resource_url: href,
  });
};

export const trackContactSubmission = () => {
  event('contact_form_submitted', {
    event_category: 'lead_generation',
    value: 1,
    user_engagement: 'content_engagement',
  });
};

// Enhanced goal tracking
export const trackGoalCompletion = (goalType: 'fasting_completed' | 'blog_engagement' | 'resource_accessed') => {
  event('goal_completion', {
    event_category: 'conversions',
    event_label: goalType,
    value: 1,
    goal_type: goalType,
  });
};

// Page engagement tracking
export const trackPageEngagement = (timeOnPage: number, pageDepth: number) => {
  event('page_engagement', {
    event_category: 'engagement',
    value: timeOnPage,
    time_on_page_seconds: timeOnPage,
    page_depth: pageDepth,
  });
};
