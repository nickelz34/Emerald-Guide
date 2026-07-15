/**
 * Brand mark: a Gen III–style faceted emerald with a soft light shimmer.
 * Palette and hard facet cuts echo pokeemerald bag-gem sprites (Star Piece, shards).
 */
import { useId } from "react";

export function EmeraldGemIcon({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, "");
  const bodyId = `emerald-gem-body-${uid}`;
  const facetLtId = `emerald-gem-facet-lt-${uid}`;
  const facetDkId = `emerald-gem-facet-dk-${uid}`;
  const shimmerId = `emerald-gem-shimmer-${uid}`;
  const clipId = `emerald-gem-clip-${uid}`;

  return (
    <span className={`emerald-gem ${className ?? ""}`} aria-hidden="true">
      <svg
        className="emerald-gem__svg"
        viewBox="0 0 32 32"
        width="34"
        height="34"
        role="img"
        focusable="false"
      >
        <defs>
          <linearGradient id={bodyId} x1="6" y1="4" x2="26" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="28%" stopColor="#34d399" />
            <stop offset="62%" stopColor="#059669" />
            <stop offset="100%" stopColor="#064e3b" />
          </linearGradient>
          <linearGradient id={facetLtId} x1="10" y1="6" x2="18" y2="18" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ecfdf5" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#6ee7b7" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={facetDkId} x1="18" y1="12" x2="26" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#047857" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#022c22" stopOpacity="0.85" />
          </linearGradient>
          <linearGradient id={shimmerId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity="0" />
            <stop offset="35%" stopColor="#fff" stopOpacity="0" />
            <stop offset="50%" stopColor="#fff" stopOpacity="0.9" />
            <stop offset="65%" stopColor="#a7f3d0" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <clipPath id={clipId}>
            <path d="M16 2.5 L26.5 9.2 L26.5 18.8 L16 29.5 L5.5 18.8 L5.5 9.2 Z" />
          </clipPath>
        </defs>

        {/* Soft emerald glow behind the stone */}
        <ellipse className="emerald-gem__aura" cx="16" cy="17" rx="11" ry="12" fill="#34d399" opacity="0.22" />

        {/* Outer black outline — classic Gen III bag-icon edge */}
        <path
          d="M16 1.75 L27.35 8.85 L27.35 19.15 L16 30.25 L4.65 19.15 L4.65 8.85 Z"
          fill="#04140e"
        />

        {/* Main faceted body */}
        <path
          d="M16 2.5 L26.5 9.2 L26.5 18.8 L16 29.5 L5.5 18.8 L5.5 9.2 Z"
          fill={`url(#${bodyId})`}
        />

        {/* Crown / table facets */}
        <path d="M16 2.5 L26.5 9.2 L16 12.2 Z" fill="#6ee7b7" opacity="0.55" />
        <path d="M16 2.5 L5.5 9.2 L16 12.2 Z" fill="#a7f3d0" opacity="0.75" />
        <path d="M5.5 9.2 L16 12.2 L16 18.2 L5.5 18.8 Z" fill="#10b981" opacity="0.45" />
        <path d="M26.5 9.2 L16 12.2 L16 18.2 L26.5 18.8 Z" fill={`url(#${facetDkId})`} />
        <path d="M5.5 18.8 L16 18.2 L16 29.5 Z" fill="#047857" opacity="0.55" />
        <path d="M26.5 18.8 L16 18.2 L16 29.5 Z" fill="#022c22" opacity="0.55" />

        {/* Inner table highlight */}
        <path d="M16 5.2 L21.2 8.6 L16 10.4 L10.8 8.6 Z" fill={`url(#${facetLtId})`} />

        {/* Hard facet seams (pixel-era line work) */}
        <g stroke="#064e3b" strokeWidth="0.55" strokeLinecap="round" fill="none" opacity="0.7">
          <path d="M16 2.5 L16 29.5" />
          <path d="M5.5 9.2 L26.5 9.2" />
          <path d="M5.5 18.8 L26.5 18.8" />
          <path d="M5.5 9.2 L16 18.2 L26.5 9.2" />
          <path d="M5.5 18.8 L16 12.2 L26.5 18.8" />
        </g>

        {/* Specular glint — Star Piece style */}
        <rect x="10.2" y="6.4" width="2.2" height="2.2" rx="0.35" fill="#fff" opacity="0.95" />
        <rect x="12.8" y="7.6" width="1.35" height="1.35" rx="0.2" fill="#ecfdf5" opacity="0.8" />

        {/* Corner catch-lights */}
        <circle cx="22.8" cy="11.2" r="0.7" fill="#bbf7d0" opacity="0.85" />
        <circle cx="9.4" cy="16.8" r="0.55" fill="#86efac" opacity="0.7" />

        {/* Animated shimmer sweep clipped to the gem */}
        <g clipPath={`url(#${clipId})`}>
          <g transform="rotate(32 16 16)">
            <rect
              className="emerald-gem__shimmer"
              x="-20"
              y="-8"
              width="12"
              height="48"
              fill={`url(#${shimmerId})`}
            />
          </g>
        </g>

        {/* Orbiting pixel sparkles */}
        <g className="emerald-gem__sparkles" fill="#ecfdf5">
          <rect className="emerald-gem__sparkle emerald-gem__sparkle--a" x="3" y="7" width="1.5" height="1.5" />
          <rect className="emerald-gem__sparkle emerald-gem__sparkle--b" x="27" y="14" width="1.5" height="1.5" />
          <rect className="emerald-gem__sparkle emerald-gem__sparkle--c" x="7" y="25" width="1.25" height="1.25" />
          <rect className="emerald-gem__sparkle emerald-gem__sparkle--d" x="24" y="24" width="1.25" height="1.25" />
        </g>
      </svg>
    </span>
  );
}
