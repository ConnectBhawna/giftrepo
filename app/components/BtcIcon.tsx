import React from "react";

interface Props {
  size?: number;
  className?: string;
}

/** Minimal BTC "₿" icon used in confetti & decorations. */
export default function BtcIcon({ size = 20, className = "" }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <circle cx="32" cy="32" r="30" fill="#FFD166" />
      <text
        x="50%"
        y="54%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="36"
        fontWeight="bold"
        fill="#0D0D0D"
        fontFamily="monospace"
      >
        ₿
      </text>
    </svg>
  );
}
