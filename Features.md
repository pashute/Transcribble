# Transcribble Features v1.0.4

[![Transcribble interface mockup (English)](mockup.png)](https://pashute.github.io/Transcribble/mockup.html)

<details>
<summary>Hebrew interface (RTL)</summary>

![Transcribble interface mockup (Hebrew)](mockup-he.png)
</details>

**[Open the live mockup ↗](https://pashute.github.io/Transcribble/mockup.html)**: switch the interface language and hover the abbreviations. The values are illustrative only.

## Layout

<table>
  <tr>
    <td colspan="2" align="center"><b>Header</b> — Transcribble v1.0.4 · simple transcription &nbsp;|&nbsp; Avatar · Language · Theme</td>
  </tr>
  <tr>
    <td width="45%"><b>L1 · Controls</b><br>Input language · Method · Translator</td>
    <td><b>R1 · Controls</b><br>To: Hebrew ▾</td>
  </tr>
  <tr>
    <td><b>L2 · Input</b><br><i>Paste and edit text here</i><br>[LOAD SAMPLE]</td>
    <td rowspan="2"><b>R2 · Word table</b><br>Transcript · Translit · Translate · Etymology · Similar</td>
  </tr>
  <tr>
    <td><b>L3 · Output</b><br>[COPY] [TRANSLATE]</td>
  </tr>
</table>

The two columns swap sides when the UI language is RTL.

### Header

- **Left:** `Transcribble v1.0.4 — simple transcription`
- **Right:** Avatar (login, disabled for now) · UI language (English / Hebrew) · Theme (Dark / Metal / Pastel / Light)

### Left column

| Part | Contents |
|---|---|
| **L1 Controls** | **Input language:** Auto-detect, Ge'ez, Amharic, Tigrinya, Aramaic, Arabic, Hebrew, Akkadian<br>**Method:** Phonetic / Etymological (preserves glottal & emphatic marks)<br>**Translator (מתרגם):** options depend on the input language (see *Translators*) |
| **L2 Input** | Scrollable, editable text area. Placeholder: *Paste and edit text here*<br>**LOAD SAMPLE**: loads a sample in the selected input language. Ge'ez: Book of Jubilees (*Mets'hafe Kufale*), ch. 1. |
| **L3 Output** | Scrollable, selectable transcript.<br>**COPY**: copies the output.<br>**TRANSLATE**: opens the full text in Google Translate (source: auto, target: the **To:** language). |

### Right column

**R1 Controls**: **To:** Hebrew (default), English. More languages later.

**R2 Word table**: one row per word of the input. A cell can hold two lines (top / bottom). Single-line cells are centered horizontally.

| Column | Top | Bottom |
|---|---|---|
| **Transcript** | original word | transcript in the target script, vowels dropped |
| **Translit** | vocalized transliteration in the target script | Arabizi of the transliteration |
| **Translate** | meaning in context | grammar (POS, person, number, tense) |
| **Etymology** | telegraphic, 3–4 words with abbreviations | — |
| **Similar** | phonetically similar roots with related meanings in Hebrew and other Semitic languages | — |

- **Links:** the top word of a row opens the selected **Translator** for that word.
- **Abbreviations:** language abbreviations expand on hover, e.g. <sub>bh</sub> מחזה ma2ze, where hovering *bh* shows "Biblical Hebrew".

---

## Functionality

- **Transcript drops vowels.** Only consonants are written in the target script (e.g. Hebrew without niqqud). The vowels appear in the **Translit** column.
- **Similar, by meaning.** When the transcript's root has a counterpart in the target language with a similar sound *and* meaning, show it. Example: the transcript gives חטב, meaning "wrote", so Similar shows **כתב**.

### Translators

The **Translator** list is rebuilt whenever the input language changes, and the first option is selected. It controls the word links in the table. **TRANSLATE** (full text) always uses Google Translate.

| Input language | Translator options (first = default) |
|---|---|
| Auto-detect | Google Translate (auto-detect) |
| Ge'ez | Google Translate (auto-detect) · [Dillmann, *Lexicon Linguae Aethiopicae* (Beta maṣāḥǝft)](https://betamasaheft.eu/Dillmann/) · [Leslau, *Comparative Dictionary of Ge'ez*](https://archive.org/details/leslau-comparative-dictionary-of-geez-1987) · English Wiktionary (Ge'ez section) |
| Amharic | Google Translate · AmharicPro · Wiktionary |
| Tigrinya | Google Translate · Wiktionary |
| Aramaic | Wiktionary · CAL (Comprehensive Aramaic Lexicon) |
| Arabic | Google Translate · Wiktionary |
| Hebrew | Google Translate · Wiktionary |
| Akkadian | TBD (Google Translate doesn't support Akkadian) |

- **Google Translate** is sent with source = auto and target = the **To:** language.
- **Dillmann** and **Leslau** have no search URL, so they open the dictionary itself and copy the word to the clipboard for pasting.
- **Samples:** one per input language, loaded with **LOAD SAMPLE**.

### Interface language

Supported: **English** (LTR) and **Hebrew** (RTL). Chosen in the header and saved for the next visit. On the first visit it follows the browser language, falling back to English.

Switching it changes:

| Area | What changes |
|---|---|
| **Direction** | The page's `dir` switches between `ltr` and `rtl`. The whole layout mirrors: header ends swap, the left and right columns swap, the word-table columns run right-to-left, and controls align to the start side. |
| **Texts** | Every interface string: header tagline, control labels, option names (e.g. *Etymological* / אטימולוגי), placeholders, button labels, table headers, tooltips, abbreviation expansions on hover, and status messages. |
| **Fonts** | Interface font for the selected script. |

It does **not** change:

- **Content direction.** Each text keeps its own script's direction, whatever the interface language. Ge'ez and Akkadian (transliterated) are LTR. Hebrew, Arabic and Aramaic are RTL. Every table cell and line is direction-isolated (`dir="auto"` / `<bdi>`), so mixed lines such as `gz ngr "speak" · bh הגיד` keep their order.
- **Selections.** The To: language, input language, method and translator stay as set. Only their labels are translated (Ge'ez / געז).

All strings live in one file per language (`i18n/en.json`, `i18n/he.json`). Adding an interface language means adding a file. Adding an RTL language also means adding it to the RTL list.
