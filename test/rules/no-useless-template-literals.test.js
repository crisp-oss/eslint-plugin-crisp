import rule from "../../rules/no-useless-template-literals.js";
import createRuleTester from "../rule-tester.js";

const ruleTester = createRuleTester();

ruleTester.run("no-useless-template-literals", rule, {
  valid: [
    "const greeting = `Hello, ${name}`;",
    "const greeting = `Hello, ` + name;",
    "const greeting = name + `!`;",
    "const greeting = \"Hello\";"
  ],

  invalid: [
    {
      code: "const greeting = `Hello`;",
      errors: [
        {
          message: "Unnecessary use of template literals. Use regular strings instead."
        }
      ]
    },
    {
      code: "call(`plain text`);",
      errors: [
        {
          message: "Unnecessary use of template literals. Use regular strings instead."
        }
      ]
    },
    {
      code: "const values = [`first`, `second`];",
      errors: 2
    }
  ]
});
