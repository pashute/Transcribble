const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const elements = Object.fromEntries(
  ["inputText", "outputText", "systemMode", "copyStatus", "sampleButton", "clearButton", "copyButton"]
    .map(id => [id, { value: id === "systemMode" ? "geez" : "", addEventListener() {} }])
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
