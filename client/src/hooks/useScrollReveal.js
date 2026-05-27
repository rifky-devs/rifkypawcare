import { useEffect } from 'react';

/**
 * Custom React hook that implements a premium scroll-triggered reveal animation system.
 * Uses IntersectionObserver for smooth GPU-accelerated visibility tracking.
 * Uses MutationObserver to dynamically watch for API-loaded items (like products & services) and attach animations seamlessly.
 * Includes a "loop-back" mechanism (resets animation state when exiting viewport) so elements re-animate when scrolled back.
 */
export default function useScrollReveal() {
  useEffect(() => {
    // Setup high-performance IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          } else {
            // Loop back: remove the class when element leaves the screen
            // This enables the premium repeat-scrolling effect (up & down)
            entry.target.classList.remove('revealed');
          }
        });
      },
      {
        threshold: 0.05, // Triggers when 5% of the element is visible
        rootMargin: '0px 0px -20px 0px', // Triggers slightly earlier for a more responsive feel
      }
    );

    // Utility to scan the DOM and observe all elements with the 'reveal' class
    const observeAllRevealElements = () => {
      const revealElements = document.querySelectorAll('.reveal');
      revealElements.forEach((el) => {
        observer.observe(el);
      });
    };

    // Run initial observation for static elements
    observeAllRevealElements();

    // Setup MutationObserver to watch for dynamic DOM updates (e.g. products/services loaded from API)
    const mutationObserver = new MutationObserver(() => {
      observeAllRevealElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Cleanup observers on component unmount
    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
}
