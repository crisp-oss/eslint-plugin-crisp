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

test("all recommended configs reject and expand object shorthand", () => {
  for (const configName of [
    "recommended",
    "recommended-vue",
    "recommended-ts"
  ]) {
    const rules = plugin.configs[configName].find(
      config => config.rules?.["object-shorthand"]
    )?.rules;

    assert.deepEqual(rules?.["object-shorthand"], ["error", "never"]);

    const linter = new Linter();
    const config = [{
      rules: {
        "object-shorthand": rules["object-shorthand"]
      }
    }];
    const input = "const value = 1; const object = { value, method() {} };";
    const messages = linter.verify(input, config);

    assert.equal(messages.length, 2);
    assert.ok(messages.every(message => message.ruleId === "object-shorthand"));

    const result = linter.verifyAndFix(input, config);

    assert.equal(
      result.output,
      "const value = 1; const object = { value: value, method: function() {} };"
    );
    assert.deepEqual(result.messages, []);
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
