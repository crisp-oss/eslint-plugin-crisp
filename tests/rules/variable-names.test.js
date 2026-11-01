import rule from "../../rules/variable-names.js";
import createRuleTester from "../rule-tester.js";

const ruleTester = createRuleTester();

ruleTester.run("variable-names", rule, {
  valid: [
    "let topLevel = 1; var otherTopLevel = 2;",
    "function calculate() { const result = 1; let _temporary = result; }",
    "const calculate = () => { let { value } = object; let [first] = values; };",
    {
      code: "function calculate() { let result = 1; }",
      options: [
        {
          variableExceptions: ["result"]
        }
      ]
    }
  ],

  invalid: [
    {
      code: "function calculate() { let result = 1; }",
      errors: [
        {
          message: "Local variables should start with \"_\" ({result})"
        }
      ]
    },
    {
      code: "const calculate = () => { var result; };",
      errors: [
        {
          message: "Local variables should start with \"_\" ({result})"
        }
      ]
    },
    {
      code: "class Calculator { calculate() { let result = 1; } }",
      errors: [
        {
          message: "Local variables should start with \"_\" ({result})"
        }
      ]
    },
    {
      code: "function calculate() { let allowed = 1; let rejected = 2; }",
      options: [
        {
          variableExceptions: ["allowed"]
        }
      ],
      errors: [
        {
          message: "Local variables should start with \"_\" ({rejected})"
        }
      ]
    }
  ]
});
