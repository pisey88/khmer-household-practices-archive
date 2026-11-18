"use client";

// components/common/RevealOnScroll.js
//
// Wraps a child element and adds an "is-visible" class once it scrolls into
// view, which globals.css uses to trigger a fade/slide-up. If JS is slow
// or disabled, .reveal's base CSS still shows the content — the animation
// is a bonus, not a requirement to read the page.

import { useEffect, useRef, useState } from "react";

export default function RevealOnScroll({ children }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${isVisible ? "is-visible" : ""}`}>
      {children}
    </div>
  );
}
