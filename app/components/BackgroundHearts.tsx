"use client";

import { useState, useEffect } from "react";
import PixelHeart from "./PixelHeart";

interface HeartData {
  id: number;
  left: string;
  size: number;
  duration: string;
  delay: string;
  color: string;
  opacity: number;
}

/**
 * Renders a field of pixel-hearts that gently rise from bottom to top
 * behind all page content. Uses pure CSS animations (no JS animation loop)
 * for maximum performance. Respects prefers-reduced-motion via globals.css.
 *
 * Hearts are generated only on the client (after mount) to avoid
 * SSR ↔ client hydration mismatches caused by Math.random().
 */
export default function BackgroundHearts({ count = 18 }: { count?: number }) {
  const [hearts, setHearts] = useState<HeartData[]>([]);

  useEffect(() => {
    const colors = ["#FF2D95", "#4CC1FF", "#FFD166", "#FF7EB6", "#FF2D95"];
    setHearts(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${(Math.random() * 96 + 2).toFixed(1)}%`,
        size: Math.floor(Math.random() * 20) + 10, // 10–30 px
        duration: `${(Math.random() * 12 + 8).toFixed(1)}s`, // 8–20s
        delay: `${(Math.random() * 10).toFixed(1)}s`,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.35 + 0.15, // 0.15–0.5
      }))
    );
  }, [count]);

  // Render an empty container during SSR / before mount — no mismatch
  if (hearts.length === 0) {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {hearts.map((h) => (
        <div
          key={h.id}
          className="rise-heart absolute bottom-0"
          style={
            {
              left: h.left,
              "--duration": h.duration,
              "--delay": h.delay,
              opacity: h.opacity,
            } as React.CSSProperties
          }
        >
          <PixelHeart size={h.size} style={{ color: h.color }} />
        </div>
      ))}
    </div>
  );
}
