export type SiteLanguage = {
  code: string;
  label: string;
  flag: string;
};

/** Google Translate supported languages — native names for the dropdown */
export const SITE_LANGUAGES: SiteLanguage[] = [
  { code: "en", label: "English", flag: "us" },
  { code: "hi", label: "हिन्दी", flag: "in" },
  { code: "bn", label: "বাংলা", flag: "bd" },
  { code: "ur", label: "اردو", flag: "pk" },
  { code: "pa", label: "ਪੰਜਾਬੀ", flag: "in" },
  { code: "ta", label: "தமிழ்", flag: "in" },
  { code: "te", label: "తెలుగు", flag: "in" },
  { code: "mr", label: "मराठी", flag: "in" },
  { code: "gu", label: "ગુજરાતી", flag: "in" },
  { code: "kn", label: "ಕನ್ನಡ", flag: "in" },
  { code: "ml", label: "മലയാളം", flag: "in" },
  { code: "ne", label: "नेपाली", flag: "np" },
  { code: "si", label: "සිංහල", flag: "lk" },
  { code: "ar", label: "العربية", flag: "sa" },
  { code: "fa", label: "فارسی", flag: "ir" },
  { code: "ps", label: "پښتو", flag: "af" },
  { code: "he", label: "עברית", flag: "il" },
  { code: "tr", label: "Türkçe", flag: "tr" },
  { code: "ku", label: "Kurdî", flag: "iq" },
  { code: "fr", label: "Français", flag: "fr" },
  { code: "de", label: "Deutsch", flag: "de" },
  { code: "es", label: "Español", flag: "es" },
  { code: "pt", label: "Português", flag: "pt" },
  { code: "it", label: "Italiano", flag: "it" },
  { code: "nl", label: "Nederlands", flag: "nl" },
  { code: "pl", label: "Polski", flag: "pl" },
  { code: "ru", label: "Русский", flag: "ru" },
  { code: "uk", label: "Українська", flag: "ua" },
  { code: "cs", label: "Čeština", flag: "cz" },
  { code: "sk", label: "Slovenčina", flag: "sk" },
  { code: "hu", label: "Magyar", flag: "hu" },
  { code: "ro", label: "Română", flag: "ro" },
  { code: "bg", label: "Български", flag: "bg" },
  { code: "hr", label: "Hrvatski", flag: "hr" },
  { code: "sr", label: "Српски", flag: "rs" },
  { code: "sl", label: "Slovenščina", flag: "si" },
  { code: "el", label: "Ελληνικά", flag: "gr" },
  { code: "sv", label: "Svenska", flag: "se" },
  { code: "da", label: "Dansk", flag: "dk" },
  { code: "no", label: "Norsk", flag: "no" },
  { code: "fi", label: "Suomi", flag: "fi" },
  { code: "is", label: "Íslenska", flag: "is" },
  { code: "et", label: "Eesti", flag: "ee" },
  { code: "lv", label: "Latviešu", flag: "lv" },
  { code: "lt", label: "Lietuvių", flag: "lt" },
  { code: "zh-CN", label: "简体中文", flag: "cn" },
  { code: "zh-TW", label: "繁體中文", flag: "tw" },
  { code: "ja", label: "日本語", flag: "jp" },
  { code: "ko", label: "한국어", flag: "kr" },
  { code: "vi", label: "Tiếng Việt", flag: "vn" },
  { code: "th", label: "ไทย", flag: "th" },
  { code: "id", label: "Bahasa Indonesia", flag: "id" },
  { code: "ms", label: "Bahasa Melayu", flag: "my" },
  { code: "tl", label: "Filipino", flag: "ph" },
  { code: "my", label: "မြန်မာ", flag: "mm" },
  { code: "km", label: "ខ្មែរ", flag: "kh" },
  { code: "lo", label: "ລາວ", flag: "la" },
  { code: "sw", label: "Kiswahili", flag: "ke" },
  { code: "am", label: "አማርኛ", flag: "et" },
  { code: "ha", label: "Hausa", flag: "ng" },
  { code: "yo", label: "Yorùbá", flag: "ng" },
  { code: "ig", label: "Igbo", flag: "ng" },
  { code: "zu", label: "isiZulu", flag: "za" },
  { code: "af", label: "Afrikaans", flag: "za" },
  { code: "sq", label: "Shqip", flag: "al" },
  { code: "hy", label: "Հայերեն", flag: "am" },
  { code: "az", label: "Azərbaycan", flag: "az" },
  { code: "ka", label: "ქართული", flag: "ge" },
  { code: "kk", label: "Қазақ", flag: "kz" },
  { code: "uz", label: "Oʻzbek", flag: "uz" },
  { code: "mn", label: "Монгол", flag: "mn" },
  { code: "cy", label: "Cymraeg", flag: "gb-wls" },
  { code: "ga", label: "Gaeilge", flag: "ie" },
  { code: "mt", label: "Malti", flag: "mt" },
  { code: "eu", label: "Euskara", flag: "es" },
  { code: "ca", label: "Català", flag: "es" },
  { code: "gl", label: "Galego", flag: "es" },
  { code: "co", label: "Corsu", flag: "fr" },
  { code: "haw", label: "Hawaiʻi", flag: "us" },
  { code: "mg", label: "Malagasy", flag: "mg" },
  { code: "ny", label: "Chichewa", flag: "mw" },
  { code: "sm", label: "Samoa", flag: "ws" },
  { code: "gd", label: "Gàidhlig", flag: "gb-sct" },
  { code: "sn", label: "Shona", flag: "zw" },
  { code: "st", label: "Sesotho", flag: "ls" },
  { code: "so", label: "Soomaali", flag: "so" },
  { code: "su", label: "Basa Sunda", flag: "id" },
  { code: "tg", label: "Тоҷикӣ", flag: "tj" },
  { code: "xh", label: "isiXhosa", flag: "za" },
  { code: "yi", label: "ייִדיש", flag: "il" },
  { code: "jw", label: "Basa Jawa", flag: "id" },
  { code: "hmn", label: "Hmong", flag: "la" },
  { code: "ht", label: "Kreyòl", flag: "ht" },
  { code: "lb", label: "Lëtzebuergesch", flag: "lu" },
  { code: "mk", label: "Македонски", flag: "mk" },
  { code: "bs", label: "Bosanski", flag: "ba" },
  { code: "ceb", label: "Cebuano", flag: "ph" },
  { code: "eo", label: "Esperanto", flag: "eu" },
  { code: "fy", label: "Frysk", flag: "nl" },
  { code: "la", label: "Latina", flag: "va" },
  { code: "mi", label: "Te Reo Māori", flag: "nz" },
  { code: "sd", label: "سنڌي", flag: "pk" },
];

export const LANGUAGE_CODES = SITE_LANGUAGES.map((l) => l.code).join(",");

export function getLanguageByCode(code: string): SiteLanguage {
  return SITE_LANGUAGES.find((l) => l.code === code) ?? SITE_LANGUAGES[0];
}

export function readStoredLanguage(): string {
  if (typeof window === "undefined") return "en";

  try {
    const stored = window.localStorage.getItem("tf-lang");
    if (stored) return stored === "en" ? "en" : stored;
  } catch {
    /* private mode */
  }

  if (typeof document === "undefined") return "en";
  const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]+)/);
  if (!match) return "en";
  const parts = decodeURIComponent(match[1]).split("/");
  const lang = parts[parts.length - 1];
  return lang && lang !== "en" ? lang : "en";
}

export function writeStoredLanguage(code: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem("tf-lang", code);
  } catch {
    /* private mode */
  }
}
