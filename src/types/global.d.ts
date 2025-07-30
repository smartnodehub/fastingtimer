export {};

declare global {
  interface Window {
    /** AdSense global array */
    adsbygoogle?: unknown[];
    /** Google Analytics gtag function */
    gtag?: (
      command: 'config' | 'event' | 'consent',
      targetId: string,
      config?: Record<string, string | number | boolean | undefined>
    ) => void;
  }
}
