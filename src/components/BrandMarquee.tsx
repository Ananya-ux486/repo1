"use client";

const brands = [
  "WEB DEVELOPMENT",
  "STATIC SITES",
  "LANDING PAGES",
  "E-COMMERCE",
  "CYBER SECURITY",
  "AI POWERED",
  "ENTERPRISE SOFTWARE",
];

export default function BrandMarquee() {
  const items = [...brands, ...brands];

  return (
    <div className="relative overflow-hidden border-y border-white/50 bg-gradient-to-r from-sky-100/60 via-white/40 to-pink-100/60 py-3 lg:py-4">
      <div className="marquee-track marquee-left flex w-max whitespace-nowrap">
        {items.map((brand, i) => (
          <span
            key={`${brand}-${i}`}
            className="mx-4 text-xs font-bold uppercase tracking-[0.2em] text-foreground/50 sm:mx-6 lg:mx-8 lg:text-sm lg:tracking-[0.3em]"
          >
            {brand}
            <span className="mx-8 text-brand">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
