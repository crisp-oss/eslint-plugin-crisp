import assert from "node:assert/strict";
import test from "node:test";
import { Linter } from "eslint";

import plugin from "../index.js";

const recommendedRules = plugin.configs.recommended.find(
  config => config.rules?.["no-multi-spaces"]
).rules;

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
