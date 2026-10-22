import assert from "node:assert/strict";
import { readdir } from "node:fs/promises";
import test from "node:test";

test("every rule has a matching unit test file", async () => {
  const ruleFiles = await readdir(new URL("../rules/", import.meta.url));
  const testFiles = await readdir(new URL("./rules/", import.meta.url));

  const rules = ruleFiles
    .filter(file => file.endsWith(".js"))
    .map(file => file.slice(0, -3))
    .sort();
  const testedRules = testFiles
    .filter(file => file.endsWith(".test.js"))
    .map(file => file.slice(0, -8))
    .sort();

  assert.deepEqual(testedRules, rules);
});
