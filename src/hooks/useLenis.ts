import React, { useEffect } from 'react';
import Lenis from 'lenis';

let lenisInstance: Lenis | null = null;

export const useLenis = () => {
  useEffect(() => {
    // Initialize Lenis only once
    if (!lenisInstance) {
      lenisInstance = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        wheelMultiplier: 1,
        touchMultiplier: 2,
      });

      function raf(time: number) {
        lenisInstance?.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);
    }

    return () => {
      // Don't destroy on component unmount to maintain smooth scrolling across route changes
    };
  }, []);

  return lenisInstance;
};

export const stopLenis = () => {
  lenisInstance?.stop();
};

export const startLenis = () => {
  lenisInstance?.start();
};

export const scrollTo = (target: string | number, options?: any) => {
  lenisInstance?.scrollTo(target, options);
};