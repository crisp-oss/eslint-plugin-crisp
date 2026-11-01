import rule from "../../rules/no-var-in-blocks.js";
import createRuleTester from "../rule-tester.js";

const ruleTester = createRuleTester();

ruleTester.run("no-var-in-blocks", rule, {
  valid: [
    "var topLevel = 1;",
    "function load() { var dependency = require(\"dependency\"); }",
    "const load = () => { var member = require(\"dependency\").member; };",
    "function calculate() { let result = 1; const other = 2; }"
  ],

  invalid: [
    {
      code: "function calculate() { var result = 1; }",
      errors: [
        {
          message: "Unexpected 'var' declaration inside function, method, or class block."
        }
      ]
    },
    {
      code: "const calculate = function() { var result; };",
      errors: [
        {
          message: "Unexpected 'var' declaration inside function, method, or class block."
        }
      ]
    },
    {
      code: "class Calculator { calculate() { var result = 1; } }",
      errors: [
        {
          message: "Unexpected 'var' declaration inside function, method, or class block."
        }
      ]
    }
  ]
});
