import rule from "../../rules/align-one-var.js";
import createRuleTester from "../rule-tester.js";

const ruleTester = createRuleTester();

ruleTester.run("align-one-var", rule, {
  valid: [
    "const first = 1,\n      next  = 2;",
    "const first = 1, next = 2;",
    "let first,\n    next;"
  ],

  invalid: [
    {
      code: "const first = 1,\n       next = 2;",
      errors: [
        {
          message: "Misaligned variable declaration."
        }
      ]
    },
    {
      code: "const first = 1,\n      next = 2;",
      errors: [
        {
          message: "Misaligned assignment operator."
        }
      ]
    }
  ]
});
