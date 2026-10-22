import rule from "../../rules/no-snake-case.js";
import createRuleTester from "../rule-tester.js";

const ruleTester = createRuleTester();

ruleTester.run("no-snake-case", rule, {
  valid: [
    "const MAX_RETRIES = 3;",
    "const _MAX_RETRIES = 3;",
    "let camelCase = 1;",
    "function doWork(inputValue) {}",
    "const object = { doWork(inputValue) {} };"
  ],

  invalid: [
    {
      code: "let retry_count = 1;",
      errors: [
        {
          message: "Variable 'retry_count' should not use snake_case. Use camelCase instead."
        }
      ]
    },
    {
      code: "const retry_count = 1;",
      errors: [
        {
          message: "Variable 'retry_count' should not use snake_case. Use camelCase instead."
        }
      ]
    },
    {
      code: "function do_work(inputValue) {}",
      errors: [
        {
          message: "Function 'do_work' should not use snake_case. Use camelCase instead."
        }
      ]
    },
    {
      code: "const callback = (input_value) => input_value;",
      errors: [
        {
          message: "Parameter 'input_value' should not use snake_case. Use camelCase instead."
        }
      ]
    },
    {
      code: "class Worker { do_work(inputValue) {} }",
      errors: [
        {
          message: "Method 'do_work' should not use snake_case. Use camelCase instead."
        }
      ]
    },
    {
      code: "const worker = { do_work(inputValue) {} };",
      errors: [
        {
          message: "Method 'do_work' should not use snake_case. Use camelCase instead."
        }
      ]
    }
  ]
});
