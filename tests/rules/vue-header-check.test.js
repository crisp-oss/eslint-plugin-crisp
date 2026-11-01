import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import rule from "../../rules/vue-header-check.js";
import { createVueRuleTester } from "../rule-tester.js";

const ruleTester = createVueRuleTester();
const fixturesDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../fixtures/vue-header-check"
);

function fixture(directory) {
  const filename = path.join(fixturesDirectory, directory, "TestComponent.vue");

  return {
    filename,
    code: fs.readFileSync(filename, "utf8")
  };
}

ruleTester.run("vue-header-check", rule, {
  valid: [
    fixture("valid")
  ],

  invalid: [
    {
      ...fixture("missing-template"),
      errors: [
        {
          message: "The '<template>' section must be preceded by the 'TEMPLATE' header comment."
        }
      ]
    },
    {
      ...fixture("missing-script-style"),
      errors: [
        {
          message: "The '<script>' section must be preceded by the 'SCRIPT' header comment."
        },
        {
          message: "The '<style>' section must be preceded by the 'STYLE' header comment."
        }
      ]
    }
  ]
});
