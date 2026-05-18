import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    // Scroll to top on EVERY click — even if same page
    window.scrollTo({ top: 0, behavior: 'smooth' });
    prevPathname.current = pathname;
  }, [pathname]);

  return null;
}
