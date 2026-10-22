import { RuleTester } from "eslint";
import { describe, it } from "node:test";

RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;

export default function createRuleTester({
  languageOptions = {},

  ...options
} = {}) {
  return new RuleTester({
    ...options,

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",

      ...languageOptions
    }
  });
}
