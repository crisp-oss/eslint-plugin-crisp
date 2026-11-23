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

