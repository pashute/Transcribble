const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];

function setup(fetch) {
  function element() {
    return {
      value: "", events: {}, children: [], _text: "",
      set textContent(value) { this._text = value; this.children = []; },
      get textContent() { return this._text + this.children.map(child => child.textContent).join(""); },
      addEventListener(event, handler) { this.events[event] = handler; },
      appendChild(child) { this.children.push(child); },
      replaceChildren() { this.children = []; },
      click() { this.clicked = true; }
    };
  }
  const ids = ["inputText", "outputText", "systemMode", "sourceLanguage", "direction",
    "systemGroup", "dictionaryGroup", "dictionarySource", "inputLabel", "outputLabel",
    "wordSection", "wordList", "dictionary", "copyStatus", "sampleButton", "clearButton", "copyButton"];
  const elements = Object.fromEntries(ids.map(id => [id, element()]));
  elements.systemMode.value = "geez";
  elements.sourceLanguage.value = "geez";
  elements.direction.value = "forward";
  const context = vm.createContext({
    URLSearchParams, fetch,
    document: {
      getElementById: id => elements[id],
      createElement: element,
      createTextNode: text => ({ textContent: text })
    }
  });
  vm.runInContext(script, context);
  return elements;
}

function response(page) {
  return { ok: true, json: async () => ({ query: { pages: [page] } }) };
}

function links(element) {
  return element.children.flatMap(child => child.href ? [child] : child.children ? links(child) : []);
}

test("Ge'ez defaults to Google Translate and sends the original-script stem", () => {
  const elements = setup(() => { throw new Error("Unexpected fetch"); });
  assert.equal(elements.dictionarySource.value, "googleAmharic");
  elements.inputText.value = "ወለግብረ ዝንቱ";
  elements.inputText.events.input();
  const [prefixed, plain] = elements.wordList.children;
  assert.equal(prefixed.children.at(-1).textContent, "ወለግብረ");
  prefixed.events.click();
  let link = links(elements.dictionary)[0];
  let url = new URL(link.href);
  assert.equal(url.origin, "https://translate.google.com");
  assert.equal(url.searchParams.get("sl"), "am");
  assert.equal(url.searchParams.get("tl"), "he");
  assert.equal(url.searchParams.get("text"), "ግብረ");
  assert.match(elements.dictionary.textContent, /ወለግብረ.*ግብረ/);
  assert.equal(link.clicked, true);
  plain.events.click();
  url = new URL(links(elements.dictionary)[0].href);
  assert.equal(url.searchParams.get("text"), "ዝንቱ");
  assert.equal(plain.children.at(-1).textContent, "ዝንቱ");
});

test("returning to Ge'ez restores the Google Translate default", () => {
  const elements = setup(() => { throw new Error("Unexpected fetch"); });
  elements.sourceLanguage.value = "amharic";
  elements.sourceLanguage.events.change();
  assert.equal(elements.dictionarySource.value, "amharic");
  elements.sourceLanguage.value = "geez";
  elements.sourceLanguage.events.change();
  assert.equal(elements.dictionarySource.value, "googleAmharic");
});

test("missing Ge'ez entry offers original-word search and dictionary references", async () => {
  const requests = [];
  const elements = setup(async url => {
    requests.push(new URL(url));
    return response({ missing: true, title: "ዝንቱ" });
  });
  elements.dictionarySource.value = "english";
  elements.inputText.value = "ዝንቱ";
  elements.inputText.events.input();
  const button = elements.wordList.children[0];
  assert.equal(button.children.at(-1).textContent, "ዝንቱ");
  await button.events.click();
  assert.equal(requests[0].searchParams.get("titles"), "ዝንቱ");
  assert.match(elements.dictionary.textContent, /Wiktionary \(English\)/);
  const alternatives = links(elements.dictionary);
  assert.equal(new URL(alternatives[0].href).searchParams.get("search"), "ዝንቱ");
  assert.equal(new URL(alternatives[0].href).searchParams.get("fulltext"), "1");
  assert.equal(alternatives[1].href, "https://betamasaheft.eu/Dillmann/");
  assert.equal(alternatives[2].href, "https://archive.org/details/leslau-comparative-dictionary-of-geez-1987");
});

test("a page without a Ge'ez section also offers alternatives", async () => {
  const elements = setup(async () => response({
    title: "ዝንቱ", revisions: [{ slots: { main: { content: "==Amharic==\ntext" } } }]
  }));
  elements.dictionarySource.value = "english";
  elements.inputText.value = "ዝንቱ";
  elements.inputText.events.input();
  await elements.wordList.children[0].events.click();
  assert.match(elements.dictionary.textContent, /Wiktionary \(English\)/);
  assert.equal(new URL(links(elements.dictionary)[1].href).searchParams.get("search"), "ዝንቱ");
});

test("lookup failures name the selected dictionary without claiming an entry is missing", async () => {
  const elements = setup(async () => ({ ok: false }));
  elements.dictionarySource.value = "english";
  elements.inputText.value = "ዝንቱ";
  elements.inputText.events.input();
  await elements.wordList.children[0].events.click();
  assert.match(elements.dictionary.textContent, /Wiktionary \(English\).*נכשל/);
  assert.equal(links(elements.dictionary).length, 0);
});

test("external dictionary uses the original word and identifies the selected source", () => {
  const elements = setup(() => { throw new Error("Unexpected fetch"); });
  elements.sourceLanguage.value = "amharic";
  elements.sourceLanguage.events.change();
  elements.inputText.value = "ዝንቱ";
  elements.inputText.events.input();
  elements.wordList.children[0].events.click();
  assert.match(elements.dictionary.textContent, /AmharicPro/);
  const link = links(elements.dictionary)[0];
  assert.equal(new URL(link.href).searchParams.get("searchkey"), "ዝንቱ");
  assert.equal(link.clicked, true);
});

test("changing dictionary suppresses an earlier lookup result", async () => {
  let resolveFetch;
  const elements = setup(() => new Promise(resolve => { resolveFetch = resolve; }));
  elements.dictionarySource.value = "english";
  elements.inputText.value = "ዝንቱ";
  elements.inputText.events.input();
  const pending = elements.wordList.children[0].events.click();
  elements.dictionarySource.events.change();
  resolveFetch(response({ missing: true, title: "ዝንቱ" }));
  await pending;
  assert.doesNotMatch(elements.dictionary.textContent, /לא נמצאה/);
  assert.equal(links(elements.dictionary).length, 0);
});

test("selecting Wiktionary still looks up the complete prefixed Ge'ez word", async () => {
  const requests = [];
  const elements = setup(async url => {
    requests.push(new URL(url));
    return response({ missing: true, title: "ወለግብረ" });
  });
  elements.dictionarySource.value = "english";
  elements.inputText.value = "ወለግብረ";
  elements.inputText.events.input();
  await elements.wordList.children[0].events.click();
  assert.equal(requests[0].searchParams.get("titles"), "ወለግብረ");
  assert.equal(new URL(links(elements.dictionary)[0].href).searchParams.get("search"), "ወለግብረ");
});
