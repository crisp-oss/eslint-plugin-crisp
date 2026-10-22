import rule from "../../rules/one-space-after-operator.js";
import createRuleTester from "../rule-tester.js";

const ruleTester = createRuleTester();

ruleTester.run("one-space-after-operator", rule, {
  valid: [
    "let value = 1; value = 2;",
    "let value = 1; value += 2;",
    `let helpdeskLayout = /** @type {import("vue").ComputedRef<HelpdeskLayoutContext>} */ (
  inject("helpdeskLayout")
);`,
    "const object = { key : value };",
    "const object = { method() {} };",
    {
      code: "const object = { key:  value };",
      options: [
        {
          checkColon: false
        }
      ]
    }
  ],

  invalid: [
    {
      code: "const value=  1;",
      output: "const value = 1;",
      errors: [
        {
          message: "There should be at least one space before and exactly one space after '='"
        }
      ]
    },
    {
      code: "let value = 1; value=  2;",
      output: "let value = 1; value = 2;",
      errors: [
        {
          message: "There should be at least one space before and exactly one space after '='"
        }
      ]
    },
    {
      code: "let value = 1; value+=2;",
      output: "let value = 1; value += 2;",
      errors: [
        {
          message: "There should be at least one space before and exactly one space after '+='"
        }
      ]
    },
    {
      code: "const value =1;",
      output: "const value = 1;",
      errors: [
        {
          message: "There should be at least one space before and exactly one space after '='"
        }
      ]
    },
    {
      code: "const value =/** @type {number} */ (input);",
      output: "const value = /** @type {number} */ (input);",
      errors: [
        {
          message: "There should be at least one space before and exactly one space after '='"
        }
      ]
    },
    {
      code: "const object = { key:  value };",
      output: "const object = { key : value };",
      errors: [
        {
          message: "There should be at least one space before and exactly one space after ':'"
        }
      ]
    }
  ]
});
