import assert from "node:assert/strict";
import test from "node:test";
import { Linter } from "eslint";

import plugin from "../../index.js";

test("padding-line-between-statements requires blank lines before returns", () => {
  const rules = plugin.configs["recommended-vue"].find(
    config => config.rules?.["padding-line-between-statements"]
  ).rules;
  const config = [{
    rules: {
      "padding-line-between-statements": rules["padding-line-between-statements"]
    }
  }];

  for (const input of [
    "function example() {\n  if (!this.draggedItemId) {\n    this.draggedFromGroupId = null;\n    return;\n  }\n}",
    "function example() {\n  this.draggedFromGroupId = null;\n  return;\n}"
  ]) {
    const linter = new Linter();
    const messages = linter.verify(input, config);

    assert.equal(messages.length, 1);
    assert.equal(messages[0].ruleId, "padding-line-between-statements");

    const result = linter.verifyAndFix(input, config);

    assert.equal(result.output, input.replace(/(\n +return;)/, "\n$1"));
    assert.deepEqual(result.messages, []);
  }

  assert.deepEqual(new Linter().verify(
    "function example() {\n  return;\n}",
    config
  ), []);
});
