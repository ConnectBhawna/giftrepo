import React from "react";

interface Props {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * A pixel-art heart SVG — proper heart shape with two bumps at the top
 * and a point at the bottom. Drawn on a 13×12 grid for a clean symmetric look.
 */
export default function PixelHeart({ size = 24, className = "", style }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 13 12"
      width={size}
      height={size}
      className={className}
      style={style}
      aria-hidden="true"
      shapeRendering="crispEdges"
    >
      <g fill="currentColor">
        {/* Row 0 — two bumps */}
        <rect x="1" y="0" width="3" height="1" />
        <rect x="9" y="0" width="3" height="1" />
        {/* Row 1 */}
        <rect x="0" y="1" width="5" height="1" />
        <rect x="8" y="1" width="5" height="1" />
        {/* Row 2 */}
        <rect x="0" y="2" width="13" height="1" />
        {/* Row 3 */}
        <rect x="0" y="3" width="13" height="1" />
        {/* Row 4 */}
        <rect x="1" y="4" width="11" height="1" />
        {/* Row 5 */}
        <rect x="1" y="5" width="11" height="1" />
        {/* Row 6 */}
        <rect x="2" y="6" width="9" height="1" />
        {/* Row 7 */}
        <rect x="3" y="7" width="7" height="1" />
        {/* Row 8 */}
        <rect x="4" y="8" width="5" height="1" />
        {/* Row 9 */}
        <rect x="5" y="9" width="3" height="1" />
        {/* Row 10 — tip */}
        <rect x="6" y="10" width="1" height="1" />
      </g>
    </svg>
  );
}
