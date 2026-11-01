import rule from "../../rules/ternary-parenthesis.js";
import createRuleTester from "../rule-tester.js";

const ruleTester = createRuleTester();

ruleTester.run("ternary-parenthesis", rule, {
  valid: [
    "const result = ready ? first : second;",
    "const result = !ready ? first : second;",
    "const result = (count > 0) ? first : second;",
    "const result = (ready && enabled) ? first : second;"
  ],

  invalid: [
    {
      code: "const result = count > 0 ? first : second;",
      output: "const result = (count > 0) ? first : second;",
      errors: [
        {
          message: "The condition in ternary expressions with an operator should be wrapped in parentheses"
        }
      ]
    },
    {
      code: "const result = ready && enabled ? first : second;",
      output: "const result = (ready && enabled) ? first : second;",
      errors: [
        {
          message: "The condition in ternary expressions with an operator should be wrapped in parentheses"
        }
      ]
    }
  ]
});
