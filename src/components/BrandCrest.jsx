export default function BrandCrest({ size = 44, className = 'brand-crest' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* ── Shield body ── */}
      <path
        d="M22 2L40 8V24C40 34.5 32 41 22 43.5C12 41 4 34.5 4 24V8Z"
        fill="#0d0426"
      />
      {/* Gold border */}
      <path
        d="M22 2L40 8V24C40 34.5 32 41 22 43.5C12 41 4 34.5 4 24V8Z"
        stroke="#fbbf24"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      {/* ── Aqua horizontal divider ── */}
      <line x1="5.5" y1="15" x2="38.5" y2="15" stroke="#38bdf8" strokeWidth="0.8" opacity="0.6" />

      {/* ── Gold 4-point star (top center) ── */}
      <path
        d="M22 4.5L23.5 8L27 9.5L23.5 11L22 14.5L20.5 11L17 9.5L20.5 8Z"
        fill="#fbbf24"
      />

      {/* ── Aqua accent dots (flanking star) ── */}
      <circle cx="10.5" cy="10.5" r="1.3" fill="#38bdf8" />
      <circle cx="33.5" cy="10.5" r="1.3" fill="#38bdf8" />

      {/* ── Trophy cup bowl ── */}
      <path
        d="M13.5 18H30.5V25C30.5 29.5 26.5 32 22 33C17.5 32 13.5 29.5 13.5 25Z"
        stroke="#fbbf24"
        strokeWidth="1.4"
        fill="rgba(251,191,36,0.07)"
      />
      {/* Left handle */}
      <path
        d="M13.5 20C10.5 20 10.5 25 13.5 25"
        stroke="#fbbf24"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      {/* Right handle */}
      <path
        d="M30.5 20C33.5 20 33.5 25 30.5 25"
        stroke="#fbbf24"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      {/* Stem */}
      <line x1="22" y1="33" x2="22" y2="36.5" stroke="#fbbf24" strokeWidth="1.3" />
      {/* Base */}
      <line x1="17.5" y1="36.5" x2="26.5" y2="36.5" stroke="#fbbf24" strokeWidth="1.9" strokeLinecap="round" />

      {/* ── Pink diamond at bottom point ── */}
      <path d="M22 39L24 41.5L22 43.5L20 41.5Z" fill="#f472b6" />
    </svg>
  )
}
