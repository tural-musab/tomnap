/**
 * Lazy loading utilities for optimal performance
 */

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

// Loading component
export const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
  </div>
);

// Loading skeleton for cards
export const CardSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
  </div>
);

// Loading skeleton for video player
export const VideoSkeleton = () => (
  <div className="animate-pulse aspect-[9/16] bg-gray-200 dark:bg-gray-700 rounded-lg">
    <div className="flex items-center justify-center h-full">
      <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
    </div>
  </div>
);

// Lazy load with custom loading component
export function lazyLoadComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  LoadingComponent: ComponentType = LoadingSpinner
) {
  return dynamic(importFunc, {
    loading: () => <LoadingComponent />,
    ssr: false,
  });
}

// Lazy load with SSR
export function lazyLoadWithSSR<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  LoadingComponent: ComponentType = LoadingSpinner
) {
  return dynamic(importFunc, {
    loading: () => <LoadingComponent />,
    ssr: true,
  });
}

// Intersection Observer hook for lazy loading
import { useEffect, useRef, useState } from 'react';

export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [options]);

  return { targetRef, isIntersecting };
}

// Lazy load component on visibility
export function LazyLoadOnView({
  children,
  threshold = 0.1,
  rootMargin = '100px',
}: {
  children: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
}) {
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold,
    rootMargin,
  });

  return <div ref={targetRef}>{isIntersecting ? children : <LoadingSpinner />}</div>;
}
