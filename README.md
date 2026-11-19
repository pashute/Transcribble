# Transcribble

A standalone transcription app that maps Ethiopic script (Ge'ez and Amharic) or Arabic script to Hebrew without vowel marks.

Open `index.html` in a browser; no installation, server, or internet connection is required. Choose a source language, type or paste text, and copy the result. For Ethiopic, choose the etymological Ge'ez or modern Amharic mapping. Switching languages keeps the input intact; the sample button loads a sample for the selected language. The interface is in Hebrew.

The Ethiopic mapping follows the supplied consonant table. The Arabic mapping is character-based: it removes Arabic vowel marks, shadda and tatweel, but retains letters such as alif, waw and ya, which may represent long vowels. It maps ta marbuta to ה and alif maqsura to א. Arabic and Ethiopic punctuation are converted, and unsupported characters are left unchanged. This is a transcription aid, not translation or a complete linguistic transcription; consonant distinctions may use Hebrew marks such as shin dots, dagesh, and geresh.

To run the checks, use `node --test test/transcription.test.js`.
