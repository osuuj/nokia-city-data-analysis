import { useEffect, useRef, useState } from "react";

interface UseInfiniteScrollProps {
  hasMore: boolean;
  onLoadMore: () => void;
}

export function useInfiniteScroll({ hasMore, onLoadMore }: UseInfiniteScrollProps) {
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (!loaderRef.current || !hasMore || isFetching) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsFetching(true);
          onLoadMore();
          setTimeout(() => setIsFetching(false), 500); // Prevents rapid API calls
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, isFetching, onLoadMore]);

  return loaderRef;
}