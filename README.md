# Transcribble

A standalone transcription app that maps Ethiopic script (Ge'ez and Amharic) or Arabic script to Hebrew without vowel marks.

Download the repository as a ZIP from GitHub, extract it, and open `index.html` in a browser. No installation or server is required. Choose a source language and direction, type or paste text, and copy the result. For Ethiopic, choose the etymological Ge'ez or modern Amharic mapping. Switching languages or directions keeps the input intact; the sample button loads a sample for the selected mode. The interface is in Hebrew.

The Ethiopic mapping follows the supplied consonant table. The Arabic mapping is character-based: it removes Arabic vowel marks, shadda and tatweel, but retains letters such as alif, waw and ya, which may represent long vowels. It maps ta marbuta to ה and alif maqsura to א. Arabic and Ethiopic punctuation are converted, and unsupported characters are left unchanged. This is a transcription aid, not translation or a complete linguistic transcription; consonant distinctions may use Hebrew marks such as shin dots, dagesh, and geresh.

In the forward direction, clickable words below the output show possible initial prefixes separately (Ge'ez ወ, ለ, በ or Arabic و, ل, ب). This is a visual heuristic, not morphological analysis: it can mark part of a root as a prefix and does not change the copied text.

Clicking a word sends the original word to the English Wiktionary API and requires an internet connection. The app extracts explicitly marked Arabic roots and Hebrew or Arabic cognates from the matching language section when available, and links to the full entry. Cognates are not necessarily translations; not all entries contain these fields, and the limited extraction does not cover every Wiktionary format. Entries are attributed to [Wiktionary](https://en.wiktionary.org/) and its contributors; see its [terms of use](https://foundation.wikimedia.org/wiki/Policy:Terms_of_Use).

Reverse transcription is approximate, not a reconstruction: it chooses one form where multiple source letters or vowels correspond to the same Hebrew spelling. For Ethiopic it uses the sixth order, so the result may not occur in a source text. Unsupported characters are preserved. Dictionary lookup and prefix highlighting are available in the forward direction only.
