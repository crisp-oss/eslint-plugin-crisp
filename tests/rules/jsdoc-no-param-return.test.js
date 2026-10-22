import rule from "../../rules/jsdoc-no-param-return.js";
import createRuleTester, { withoutFixes } from "../rule-tester.js";

const ruleTester = createRuleTester();

ruleTester.run("jsdoc-no-param-return", withoutFixes(rule), {
  valid: [
    "/**\n * Describe a function without signature tags.\n * @public\n */\nfunction example(value) { return value; }",
    "/**\n * @property {string} value A property.\n * @type {Object}\n */\nconst object = {};",
    "// @param is ordinary line-comment text.\nfunction example(value) {}"
  ],

  invalid: [
    {
      code: "/**\n * @param {string} value A value.\n */\nfunction example(value) {}",
      errors: [
        {
          message: "@param and @return tags are not permitted in JSDoc, rely on the TypeScript signature instead."
        }
      ]
    },
    {
      code: "/**\n * @arg {string} value A value.\n * @argument {number} count A count.\n */\nfunction example(value, count) {}",
      errors: [
        {
          message: "@param and @return tags are not permitted in JSDoc, rely on the TypeScript signature instead."
        }
      ]
    },
    {
      code: "/**\n * @return {string} A value.\n * @returns {string} Another value.\n */\nfunction example() { return \"value\"; }",
      errors: [
        {
          message: "@param and @return tags are not permitted in JSDoc, rely on the TypeScript signature instead."
        }
      ]
    },
    {
      code: "/**\n * @yield {number} A value.\n * @yields {number} Another value.\n */\nfunction* example() { yield 1; }",
      errors: [
        {
          message: "@param and @return tags are not permitted in JSDoc, rely on the TypeScript signature instead."
        }
      ]
    }
  ]
});
