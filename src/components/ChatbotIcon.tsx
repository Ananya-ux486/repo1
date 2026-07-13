/** Compact 3D-style AI assistant mark (teal → indigo, not brand orange). */
export default function ChatbotIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      aria-hidden
      fill="none"
    >
      <defs>
        <linearGradient id="tf-bot-body" x1="8" y1="6" x2="32" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#67e8f9" />
          <stop offset="0.45" stopColor="#38bdf8" />
          <stop offset="1" stopColor="#6366f1" />
        </linearGradient>
        <linearGradient id="tf-bot-shine" x1="12" y1="8" x2="28" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" stopOpacity="0.85" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <filter id="tf-bot-depth" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.2" floodColor="#0e7490" floodOpacity="0.45" />
        </filter>
      </defs>

      {/* Soft base shadow */}
      <ellipse cx="20" cy="34" rx="11" ry="2.4" fill="#0f172a" opacity="0.18" />

      {/* Antenna */}
      <circle cx="20" cy="5.5" r="2.2" fill="#a5f3fc" stroke="#fff" strokeWidth="0.8" />
      <path d="M20 7.5v3.2" stroke="#e0f2fe" strokeWidth="1.6" strokeLinecap="round" />

      {/* Head / body — layered for 3D */}
      <g filter="url(#tf-bot-depth)">
        <rect x="8" y="10.5" width="24" height="20" rx="8" fill="url(#tf-bot-body)" />
        <rect x="8" y="10.5" width="24" height="10" rx="8" fill="url(#tf-bot-shine)" opacity="0.55" />
        {/* Side depth bevel */}
        <path
          d="M29.5 14c1.2 1.4 1.8 3.2 1.8 5.5 0 5.2-3.4 9-7.8 9.8"
          stroke="#312e81"
          strokeOpacity="0.28"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>

      {/* Visor */}
      <rect x="12" y="16" width="16" height="8.5" rx="4.25" fill="#0f172a" opacity="0.55" />
      <rect x="12.8" y="16.7" width="14.4" height="7.1" rx="3.55" fill="#022c3a" />

      {/* Eyes */}
      <circle cx="16.6" cy="20.2" r="1.7" fill="#67e8f9" />
      <circle cx="23.4" cy="20.2" r="1.7" fill="#67e8f9" />
      <circle cx="16.1" cy="19.7" r="0.55" fill="#fff" opacity="0.9" />
      <circle cx="22.9" cy="19.7" r="0.55" fill="#fff" opacity="0.9" />

      {/* Ear nodes */}
      <circle cx="7.2" cy="20.5" r="2.1" fill="#22d3ee" stroke="#fff" strokeWidth="0.7" />
      <circle cx="32.8" cy="20.5" r="2.1" fill="#818cf8" stroke="#fff" strokeWidth="0.7" />
    </svg>
  );
}
