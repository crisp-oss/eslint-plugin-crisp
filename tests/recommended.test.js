import assert from "node:assert/strict";
import test from "node:test";
import { Linter } from "eslint";
import pluginTS from "typescript-eslint";

import plugin from "../index.js";

const recommendedRules = plugin.configs.recommended.find(
  config => config.rules?.["no-multi-spaces"]
).rules;

test("all recommended configs reject multiple spaces", () => {
  for (const configName of [
    "recommended",
    "recommended-vue",
    "recommended-ts",
    "recommended-vue-ts"
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


test("recommended-vue-ts config parses Vue scripts as TypeScript", () => {
  const vueConfig = plugin.configs["recommended-vue-ts"].findLast(
    config => config.files?.includes("**/*.vue") &&
      config.rules?.["vue/block-lang"]
  );

  assert.ok(vueConfig);
  assert.equal(vueConfig.languageOptions.parserOptions.parser, pluginTS.parser);
  assert.deepEqual(vueConfig.rules["vue/block-lang"][1], {
    script: {
      lang: "ts"
    }
  });
});
