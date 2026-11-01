import rule from "../../rules/jsdoc-description-multiline.js";
import createRuleTester from "../rule-tester.js";

const ruleTester = createRuleTester();

ruleTester.run("jsdoc-description-multiline", rule, {
  valid: [
    "/**\n * A multiline description.\n */\nfunction example() {}",
    "/** */\nfunction empty() {}",
    "/** @public */\nfunction tagged() {}",
    "/**\n * @returns {boolean} The result.\n */\nfunction tagged() { return true; }"
  ],

  invalid: [
    {
      code: "/** A compact description. */\nfunction example() {}",
      output: "/**\n * A compact description.\n */\nfunction example() {}",
      errors: [
        {
          message: "Function JSDoc descriptions must use multiline formatting."
        }
      ]
    },
    {
      code: "function outer() {\n  /** An indented description. */\n  function inner() {}\n}",
      output: "function outer() {\n  /**\n   * An indented description.\n   */\n  function inner() {}\n}",
      errors: [
        {
          message: "Function JSDoc descriptions must use multiline formatting."
        }
      ]
    }
  ]
});
