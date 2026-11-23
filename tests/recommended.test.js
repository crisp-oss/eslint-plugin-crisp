import assert from "node:assert/strict";
import test from "node:test";
import { Linter } from "eslint";

import plugin from "../index.js";

const recommendedRules = plugin.configs.recommended.find(
  config => config.rules?.["no-multi-spaces"]
).rules;

test("recommended-vue enables watcher option ordering", () => {
  assert.ok(plugin.rules["vue-watch-order"]);
  assert.ok(plugin.configs["recommended-vue"].some(
    config => config.rules?.["crisp/vue-watch-order"] === "error"
  ));
});

test("recommended-vue requires blank lines before returns", () => {
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

test("all recommended configs reject multiple spaces", () => {
  for (const configName of [
    "recommended",
    "recommended-vue",
    "recommended-ts"
  ]) {
    assert.ok(plugin.configs[configName].some(
      config => config.rules?.["no-multi-spaces"] === "error"
    ));
  }
});

test("recommended config uses standard default parameter spacing", () => {
  const result = new Linter().verifyAndFix(
    "function greet(name=\"World\") {}",
    [{
      rules: {
        "space-infix-ops": recommendedRules["space-infix-ops"]
      }
    }]
  );

  assert.equal(result.output, "function greet(name = \"World\") {}");
});

test("recommended config removes legacy assignment alignment", () => {
  const input = `class Example {
  constructor() {
    this.a    = 1;
    this.long = 2;
  }
}

const first = 1,
      second  = 2;

const alpha = require("alpha"),
      beta  = require("beta");
`;
  const expected = `class Example {
  constructor() {
    this.a = 1;
    this.long = 2;
  }
}

const first = 1,
  second = 2;

const alpha = require("alpha"),
  beta = require("beta");
`;
  const result = new Linter().verifyAndFix(input, [{
    rules: {
      indent: recommendedRules.indent,
      "no-multi-spaces": recommendedRules["no-multi-spaces"]
    }
  }]);

  assert.equal(result.output, expected);
});
