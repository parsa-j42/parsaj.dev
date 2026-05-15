// Single source of truth for the "are we on a phone-ish viewport" check.
// Components subscribe via the hook so they re-render on rotate / resize.

import { useState, useEffect } from 'react';

export const MOBILE_BREAKPOINT = 768;

export default function useIsMobile(breakpoint = MOBILE_BREAKPOINT) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= breakpoint
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= breakpoint);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [breakpoint]);

  return isMobile;
}
