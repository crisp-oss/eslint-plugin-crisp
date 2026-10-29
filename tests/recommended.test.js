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

test("JS and TS recommended configs reject and expand property and method shorthand", () => {
  for (const configName of ["recommended", "recommended-ts"]) {
    const rules = plugin.configs[configName].find(
      config => config.rules?.["object-shorthand"]
    ).rules;

    assert.deepEqual(rules["object-shorthand"], ["error", "never"]);
    assert.ok(!JSON.stringify(rules["no-restricted-syntax"] ?? []).includes("shorthand"));

    const linter = new Linter();
    const config = [{ rules: { "object-shorthand": rules["object-shorthand"] } }];
    const input = "const object = { value, method() {} };";
    const messages = linter.verify(input, config);

    assert.equal(messages.length, 2);
    assert.ok(messages.every(message => message.ruleId === "object-shorthand"));

    const result = linter.verifyAndFix(input, config);

    assert.equal(result.output, "const object = { value: value, method: function() {} };");
    assert.deepEqual(result.messages, []);
  }
});

test("Vue recommended config rejects property shorthand but allows methods and components", () => {
  for (const configName of ["recommended-vue"]) {
    const rules = plugin.configs[configName].find(
      config => config.rules?.["no-restricted-syntax"]
    ).rules;

    assert.ok(plugin.configs[configName].every(
      config => !Object.hasOwn(config.rules ?? {}, "object-shorthand")
    ));

    const linter = new Linter();
    const config = [{
      rules: {
        "no-restricted-syntax": rules["no-restricted-syntax"]
      }
    }];

    for (const input of [
      "const object = { value };",
      "this.setTreeContent({ section, locale, path, value: contentData });",
      "const object = { components: { nested: { value } } };",
      "export default { nested: { value } };",
      "const object = { value }; export default object;",
      "defineComponent({ data() { return { value }; } });"
    ]) {
      const messages = linter.verify(input, config);

      assert.ok(messages.length > 0, `${configName}: ${input}`);
      assert.ok(messages.every(message =>
        message.ruleId === "no-restricted-syntax" &&
        message.message === "Use explicit keys and values instead of shorthand properties."
      ));
    }

    for (const input of [
      "const object = { value: value, method() {} };",
      "export default { base, form, initiate, layouts, common, hugo, editor, settings };",
      "export default { components: { ContentNavigate }, mounted() {} };",
      "export default defineComponent({ components: { ContentNavigate }, data() { return {}; } });",
      "defineComponent({ 'components': { ContentNavigate } });",
      "const { value } = object;"
    ]) {
      assert.deepEqual(linter.verify(input, config), [], `${configName}: ${input}`);
    }
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
