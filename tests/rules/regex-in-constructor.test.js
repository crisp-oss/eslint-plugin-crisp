import rule from "../../rules/regex-in-constructor.js";
import createRuleTester from "../rule-tester.js";

const ruleTester = createRuleTester();

ruleTester.run("regex-in-constructor", rule, {
  valid: [
    "class Matcher { constructor() { this.pattern = /value/i; } }",
    "function matches(value) { return /value/.test(value); }",
    "class Matcher { matches(value) { return new RegExp(value).test(value); } }",
    "class Matcher { pattern = /value/; }"
  ],

  invalid: [
    {
      code: "class Matcher { matches(value) { return /value/i.test(value); } }",
      errors: [
        {
          message: "Regular expressions should be defined in the constructor."
        }
      ]
    },
    {
      code: "class Matcher { static matches(value) { return /value/.test(value); } }",
      errors: [
        {
          message: "Regular expressions should be defined in the constructor."
        }
      ]
    },
    {
      code: "class Matcher { matches(value) { return /first/.test(value) || /second/.test(value); } }",
      errors: [
        {
          message: "Regular expressions should be defined in the constructor."
        }
      ]
    }
  ]
});
