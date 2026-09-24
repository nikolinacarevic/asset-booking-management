import * as React from 'react';

/**
 * Subscribes to a CSS media query. Returns `fallback` when `matchMedia`
 * is unavailable (e.g. jsdom in unit tests).
 */
export function useMediaQuery(query: string, fallback = false): boolean {
  const subscribe = React.useCallback(
    (onChange: () => void) => {
      if (typeof window === 'undefined' || !window.matchMedia) {
        return () => {};
      }
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    [query]
  );

  const getSnapshot = () =>
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia(query).matches
      : fallback;

  return React.useSyncExternalStore(subscribe, getSnapshot, () => fallback);
}
