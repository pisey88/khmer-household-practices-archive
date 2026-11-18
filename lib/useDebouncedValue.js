"use client";

// lib/useDebouncedValue.js
//
// Returns `value`, but delayed by `delayMs` after the last change. Used by
// ArchiveGrid so typing in the search box doesn't re-filter on every
// keystroke. Negligible at 5 entries today, but keeps the UI smooth as the
// archive grows without needing to touch the filtering logic later.

import { useEffect, useState } from "react";

export function useDebouncedValue(value, delayMs = 150) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
