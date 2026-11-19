const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const elements = Object.fromEntries(
  ["inputText", "outputText", "systemMode", "sourceLanguage", "systemGroup", "inputLabel", "copyStatus", "sampleButton", "clearButton", "copyButton"]
    .map(id => [id, {
      value: id === "systemMode" ? "geez" : id === "sourceLanguage" ? "ethiopic" : "",
      events: {},
      addEventListener(event, handler) { this.events[event] = handler; }
    }])
);
const context = vm.createContext({ document: { getElementById: id => elements[id] } });
vm.runInContext(script, context);

test("transcribes consonants without vowel marks", () => {
  assert.equal(context.transcribe("መጽሐፈ ኩፋሌ", "geez"), "מצחף כפל");
  assert.equal(context.transcribe("ሀሁሂሃሄህሆሇ", "geez"), "הההההההה");
});

test("selects the requested consonant mapping", () => {
  assert.equal(context.transcribe("ሠዐኸፀ", "geez"), "שׂעכ׳צ׳");
  assert.equal(context.transcribe("ሠዐኸፀ", "amharic"), "סאחץ");
});

test("converts punctuation and final forms, preserving unsupported characters", () => {
  assert.equal(context.transcribe("ከ፡መ።ነ፣ፈ፤ጸ፧ ኵ 😀", "geez"), "ך ם.ן,ף;ץ? ኵ 😀");
});

test("transcribes Arabic without vowel marks or elongation", () => {
  assert.equal(context.transcribeArabic("السَّلَامُ عَلَيْكُمْ"), "אלסלאם עליכם");
  assert.equal(context.transcribeArabic("ث ج ح خ ذ ش ص ض ط ظ ع غ"), "ת׳ ג׳ ח ח׳ ד׳ שׁ ץ ץ׳ ט ט׳ ע ע׳");
  assert.equal(context.transcribeArabic("أ إ آ ؤ ئ ة ى ا\u0654"), "א א א ו י ה א א");
  assert.equal(context.transcribeArabic("كِتابٌ، نَصّ؛ فـن؟ 😀 e\u0301"), "כתאב, נץ; פן? 😀 e\u0301");
});

test("switches language without losing input and loads the corresponding sample", () => {
  elements.inputText.value = "ሠዐ";
  elements.inputText.events.input();
  assert.equal(elements.outputText.value, "שׂע");
  elements.sourceLanguage.value = "arabic";
  elements.sourceLanguage.events.change();
  assert.equal(elements.inputText.value, "ሠዐ");
  assert.equal(elements.outputText.value, "ሠዐ");
  assert.equal(elements.inputText.dir, "rtl");
  assert.equal(elements.systemGroup.hidden, true);
  elements.sampleButton.events.click();
  assert.equal(elements.outputText.value, "אלסלאם עליכם");
  elements.sourceLanguage.value = "ethiopic";
  elements.sourceLanguage.events.change();
  assert.equal(elements.inputText.dir, "ltr");
  assert.equal(elements.systemGroup.hidden, false);
  elements.sampleButton.events.click();
  assert.ok(elements.outputText.value.startsWith("זנת"));
});
