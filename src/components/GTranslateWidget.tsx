"use client";

import Script from "next/script";

const GTRANSLATE_LANGUAGES = [
  "af", "sq", "am", "ar", "hy", "az", "eu", "be", "bn", "bs", "bg", "ca", "ceb",
  "zh-CN", "zh-TW", "co", "hr", "cs", "da", "nl", "en", "eo", "et", "fi", "fr",
  "fy", "gl", "ka", "de", "el", "gu", "ht", "ha", "haw", "he", "hi", "hmn", "hu",
  "is", "ig", "id", "ga", "it", "ja", "jw", "kn", "kk", "km", "ko", "ku", "ky",
  "lo", "la", "lv", "lt", "lb", "mk", "mg", "ms", "ml", "mt", "mi", "mr", "mn",
  "my", "ne", "no", "ny", "or", "ps", "fa", "pl", "pt", "pa", "ro", "ru", "sm",
  "gd", "sr", "st", "sn", "sd", "si", "sk", "sl", "so", "es", "su", "sw", "sv",
  "tl", "tg", "ta", "tt", "te", "th", "tr", "tk", "uk", "ur", "ug", "uz", "vi",
  "cy", "xh", "yi", "yo", "zu",
];

export default function GTranslateWidget() {
  return (
    <>
      <div className="gtranslate_wrapper" />
      <Script id="gtranslate-settings" strategy="afterInteractive">
        {`
          window.gtranslateSettings = {
            default_language: "en",
            languages: ${JSON.stringify(GTRANSLATE_LANGUAGES)},
            wrapper_selector: ".gtranslate_wrapper",
            switcher_horizontal_position: "left",
            switcher_vertical_position: "bottom",
            flag_style: "circle",
            flag_size: 16
          };
        `}
      </Script>
      <Script
        src="https://cdn.gtranslate.net/widgets/latest/float.js"
        strategy="afterInteractive"
      />
    </>
  );
}
