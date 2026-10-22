import rule from "../../rules/no-space-in-optional-arguments.js";
import createRuleTester from "../rule-tester.js";

const ruleTester = createRuleTester();

ruleTester.run("no-space-in-optional-arguments", rule, {
  valid: [
    "function greet(name=\"World\") {}",
    "const greet = (name=\"World\") => name;",
    "const object = { greet(name=\"World\") {} };",
    "function required(name) {}"
  ],

  invalid: [
    {
      code: "function greet(name =\"World\") {}",
      errors: [
        {
          message: "There should be no space before or after = in optional parameters"
        }
      ]
    },
    {
      code: "const greet = (name= \"World\") => name;",
      errors: [
        {
          message: "There should be no space before or after = in optional parameters"
        }
      ]
    },
    {
      code: "class Greeter { greet(name = \"World\") {} }",
      errors: [
        {
          message: "There should be no space before or after = in optional parameters"
        }
      ]
    }
  ]
});
