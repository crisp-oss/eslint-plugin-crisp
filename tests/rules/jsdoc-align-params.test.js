import rule from "../../rules/jsdoc-align-params.js";
import createRuleTester, { withoutFixes } from "../rule-tester.js";

const ruleTester = createRuleTester();

ruleTester.run("jsdoc-align-params", withoutFixes(rule), {
  valid: [
    "/**\n * Fetch a value.\n * @public\n * @param  {string} value\n * @return {string} Result.\n */\nfunction fetchValue(value) { return value; }",
    "/**\n * Produce values.\n * @protected\n * @internal\n * @generator\n * @param  {number} count\n * @yields {number} Next value.\n */\nfunction* values(count) { yield count; }",
    "/** A compact comment. */\nconst value = 1;",
    "/**\n * Missing scope is ignored.\n * @param {string} value\n */\nfunction ignored(value) { return value; }"
  ],

  invalid: [
    {
      code: "/**\n * Fetch a value.\n * @public\n * @param {string} value\n * @return {string} Result.\n */\nfunction fetchValue(value) { return value; }",
      errors: [
        {
          message: "JSDoc alignment issue"
        }
      ]
    },
    {
      code: "/**\n * Produce values.\n * @private\n * @generator\n * @param {number} count\n * @yields {number} Next value.\n */\nfunction* values(count) { yield count; }",
      errors: [
        {
          message: "JSDoc alignment issue"
        }
      ]
    }
  ]
});
