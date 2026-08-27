import React from 'react';

interface MDJLogoProps {
  className?: string;
}

export const MDJLogo: React.FC<MDJLogoProps> = ({ className = 'w-full h-full' }) => {
  return (
    <svg
      viewBox="0 0 240 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="mdjGradCircle" x1="20" y1="20" x2="220" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="45%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0d9488" />
        </linearGradient>
        <linearGradient id="mdjGradArrow" x1="140" y1="100" x2="220" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
        <linearGradient id="mdjGradBars" x1="60" y1="160" x2="180" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1d4ed8" />
          <stop offset="50%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#14b8a6" />
        </linearGradient>
        <linearGradient id="mdjGradPerson" x1="90" y1="40" x2="150" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>
      </defs>

      {/* Main Circular Arc */}
      <path
        d="M 40 140 C 20 100 30 50 70 25 C 112 0 175 6 210 46"
        stroke="url(#mdjGradCircle)"
        strokeWidth="10"
        strokeLinecap="round"
      />

      {/* Accent Circles on Left */}
      <circle cx="34" cy="116" r="6.5" fill="#0284c7" />
      <circle cx="37" cy="136" r="4" fill="#0ea5e9" />

      {/* Lower Swoosh Leading to Arrow */}
      <path
        d="M 42 148 C 76 198 155 198 205 132 C 218 116 222 96 224 74"
        stroke="url(#mdjGradCircle)"
        strokeWidth="10"
        strokeLinecap="round"
      />

      {/* Arrow */}
      <path
        d="M 152 98 C 178 72 196 52 222 22"
        stroke="url(#mdjGradArrow)"
        strokeWidth="11"
        strokeLinecap="round"
      />
      <polygon points="224,20 184,32 198,48 206,68" fill="url(#mdjGradArrow)" />

      {/* Growth Steps / Bars */}
      <rect x="68" y="142" width="34" height="30" rx="3" fill="url(#mdjGradBars)" />
      <rect x="106" y="124" width="34" height="48" rx="3" fill="url(#mdjGradBars)" />
      <rect x="144" y="104" width="34" height="68" rx="3" fill="url(#mdjGradBars)" />

      {/* Human Figure Head */}
      <circle cx="124" cy="50" r="11" fill="url(#mdjGradPerson)" />

      {/* Human Body & Arms */}
      <path
        d="M 121 63 L 131 92"
        stroke="url(#mdjGradPerson)"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M 121 68 L 105 79 L 101 94"
        stroke="url(#mdjGradPerson)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 126 69 L 142 76 L 151 77"
        stroke="url(#mdjGradPerson)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Stepping Legs */}
      <path
        d="M 125 90 L 115 110 L 105 130"
        stroke="url(#mdjGradPerson)"
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 130 90 L 142 105 L 144 121"
        stroke="url(#mdjGradPerson)"
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
