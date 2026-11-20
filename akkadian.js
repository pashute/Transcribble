// Akkadian helpers for Transcribble.
// toAssyrianLanguagesQuery: converts an Akkadian word, written in scholarly
// transliteration (šarrum) or as a Hebrew transcript (שרמ), into the search
// notation of https://www.assyrianlanguages.org/akkadian/search.php:
//   ʾ → '   š → sz   ṣ → s,   ṭ → t,   ḫ → h
// Long or circumflexed vowels (ā ê …) become plain vowels, and hyphens and
// subscript digits are removed. A Hebrew transcript has no vowels, so the
// result is consonants only; the site's * wildcard can be added by the caller.

const AKKADIAN_LATIN = {
  "š": "sz", "Š": "sz", "ṣ": "s,", "Ṣ": "s,", "ṭ": "t,", "Ṭ": "t,",
  "ḫ": "h", "Ḫ": "h", "ʾ": "'", "ʼ": "'", "’": "'", "ˀ": "'", "ʿ": "'"
};

const AKKADIAN_HEBREW = {
  "א": "'", "ב": "b", "ג": "g", "ד": "d", "ה": "h", "ו": "w", "ז": "z",
  "ח": "h", "ט": "t,", "י": "y", "כ": "k", "ך": "k", "ל": "l", "מ": "m",
  "ם": "m", "נ": "n", "ן": "n", "ס": "s", "ע": "'", "פ": "p", "ף": "p",
  "צ": "s,", "ץ": "s,", "ק": "q", "ר": "r", "ש": "sz", "ת": "t"
};

function toAssyrianLanguagesQuery(word) {
  let result = "";
  for (const char of word.normalize("NFC")) {
    if (AKKADIAN_LATIN[char] !== undefined) { result += AKKADIAN_LATIN[char]; continue; }
    if (AKKADIAN_HEBREW[char] !== undefined) { result += AKKADIAN_HEBREW[char]; continue; }
    // Drop Hebrew points and geresh, hyphens and sign-index digits (₀–₉).
    if (/[֑-ׇ׳״\-₀-₉]/u.test(char)) continue;
    // ā â → a, etc.: strip combining marks after decomposition.
    result += char.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
  }
  return result;
}

const AKKADIAN_SEARCH_URL = "https://www.assyrianlanguages.org/akkadian/search.php";

if (typeof module !== "undefined") module.exports = { toAssyrianLanguagesQuery, AKKADIAN_SEARCH_URL };
