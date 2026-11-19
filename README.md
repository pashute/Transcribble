# Transcribble

A standalone transcription app. It currently maps Ethiopic script (Ge'ez and Amharic) to Hebrew consonants without vowel marks.

Open `index.html` in a browser; no installation, server, or internet connection is required. Type or paste text, choose the etymological Ge'ez or modern Amharic mapping, and copy the result. The sample and interface are in Hebrew.

The mapping follows the supplied consonant table. Ethiopic punctuation is converted, and unsupported characters are left unchanged. This is a character-based transcription aid, not translation or a complete linguistic transcription; consonant distinctions may use Hebrew marks such as shin dots, dagesh, and geresh.

To run the checks, use `node --test test/transcription.test.js`.
