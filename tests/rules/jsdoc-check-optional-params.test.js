import rule from "../../rules/jsdoc-check-optional-params.js";
import createRuleTester from "../rule-tester.js";

const ruleTester = createRuleTester();

ruleTester.run("jsdoc-check-optional-params", rule, {
  valid: [
    "/** @param {string} value */\nfunction required(value) {}",
    "/** @param {string} value */\nexport function required(value) {}",
    "/** @param {string} [value] */\nfunction optional(value = \"default\") {}",
    "/** @param {number} [count=1] */\nconst optional = function(count = 1) {};",
    "/* @param {string} value */\nfunction optional(value = \"default\") {}",
    "/** @param {string} value */\nconst unrelated = true;\nfunction optional(value = \"default\") {}",
    "function undocumented(value) {}"
  ],

  invalid: [
    {
      code: "/** @param {string} value */\nfunction optional(value = \"default\") {}",
      errors: [
        {
          message: "Optional parameters in JSDoc should be surrounded by brackets"
        }
      ]
    },
    {
      code: "/** @param {string} value */\nexport function optional(value = \"default\") {}",
      errors: [
        {
          message: "Optional parameters in JSDoc should be surrounded by brackets"
        }
      ]
    },
    {
      code: "/** @param {string} [value] */\nfunction required(value) {}",
      errors: [
        {
          message: "Non-optional parameters in JSDoc should not be surrounded by brackets"
        }
      ]
    },
    {
      code: "/** @param {Object} options */\nfunction configure({ enabled }) {}",
      errors: [
        {
          message: "No matching JSDoc param found"
        }
      ]
    }
  ]
});
