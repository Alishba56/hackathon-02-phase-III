import { useState, useEffect } from 'react';

const QUERY = '(prefers-reduced-motion: no-preference)';
const getInitialState = () => {
  // For server-side rendering:
  if (typeof window !== 'undefined') {
    return !window.matchMedia(QUERY).matches;
  }
  return false;
};

const useReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(getInitialState);

  useEffect(() => {
    const mediaQuery = window.matchMedia(QUERY);

    const handleChange = () => {
      setPrefersReducedMotion(!mediaQuery.matches);
    };

    handleChange();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Safari fallback
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // Safari fallback
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return prefersReducedMotion;
};

export default useReducedMotion;