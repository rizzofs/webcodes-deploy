import { useEffect, useState } from 'react';

export const useScrollEffects = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let ticking = false;

    const updateScrollY = () => {
      setScrollY(window.pageYOffset);
      setIsScrolling(true);
      
      if (!ticking) {
        requestAnimationFrame(() => {
          ticking = false;
          setIsScrolling(false);
        });
        ticking = true;
      }
    };

    const handleScroll = () => {
      updateScrollY();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return { scrollY, isScrolling };
};

export const useParallax = (speed = 0.5) => {
  const { scrollY } = useScrollEffects();
  return scrollY * speed;
};

export const useFadeInOnScroll = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold }
    );

    observer.observe(ref);

    return () => {
      if (ref) {
        observer.unobserve(ref);
      }
    };
  }, [ref, threshold]);

  return [setRef, isVisible];
};
