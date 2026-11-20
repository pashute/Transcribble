const { test } = require("node:test");
const assert = require("node:assert/strict");
const { toAssyrianLanguagesQuery: q } = require("../akkadian.js");

test("converts scholarly transliteration to assyrianlanguages.org notation", () => {
  assert.equal(q("šarrum"), "szarrum");
  assert.equal(q("ṣābum"), "s,abum");
  assert.equal(q("ṭuppum"), "t,uppum");
  assert.equal(q("ḫurāṣum"), "huras,um");
  assert.equal(q("bēlum"), "belum");
  assert.equal(q("ʾāli"), "'ali");
  assert.equal(q("Šamaš"), "szamasz");
});

test("removes hyphens and sign indices", () => {
  assert.equal(q("šar-ru-um"), "szarruum");
  assert.equal(q("ša₂"), "sza");
});

test("converts a Hebrew consonantal transcript", () => {
  assert.equal(q("שרמ"), "szrm");
  assert.equal(q("צבם"), "s,bm");
  assert.equal(q("טפּם"), "t,pm");
  assert.equal(q("אל"), "'l");
});
