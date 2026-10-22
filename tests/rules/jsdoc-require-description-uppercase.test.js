import rule from "../../rules/jsdoc-require-description-uppercase.js";
import createRuleTester from "../rule-tester.js";

const ruleTester = createRuleTester();

ruleTester.run("jsdoc-require-description-uppercase", rule, {
  valid: [
    "/**\n * Starts with an uppercase character.\n */\nfunction example() {}",
    "/**\n * # heading ignored\n * Description below the heading.\n */\nfunction example() {}",
    "/**\n * | column | value |\n * | --- | --- |\n */\nconst table = true;",
    "/**\n * @param {string} value Uppercase parameter description.\n * @returns {boolean} Uppercase return description.\n * @throws {Error} Uppercase error description.\n */\nfunction example(value) { return Boolean(value); }"
  ],

  invalid: [
    {
      code: "/**\n * lowercase description.\n */\nfunction example() {}",
      output: "/**\n * Lowercase description.\n */\nfunction example() {}",
      errors: [
        {
          message: "Sentences should start with an uppercase character."
        }
      ]
    },
    {
      code: "/**\n * @param {string} value lowercase parameter description.\n */\nfunction example(value) {}",
      output: "/**\n * @param {string} value Lowercase parameter description.\n */\nfunction example(value) {}",
      errors: [
        {
          message: "Sentences should start with an uppercase character."
        }
      ]
    },
    {
      code: "/**\n * @returns {boolean} lowercase return description.\n */\nfunction example() { return true; }",
      output: "/**\n * @returns {boolean} Lowercase return description.\n */\nfunction example() { return true; }",
      errors: [
        {
          message: "Sentences should start with an uppercase character."
        }
      ]
    },
    {
      code: "/**\n * @classdesc lowercase class description.\n */\nclass Example {}",
      output: "/**\n * @classdesc Lowercase class description.\n */\nclass Example {}",
      errors: [
        {
          message: "Sentences should start with an uppercase character."
        }
      ]
    }
  ]
});
