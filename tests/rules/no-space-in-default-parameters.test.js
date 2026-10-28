import rule from "../../rules/no-space-in-default-parameters.js";
import createRuleTester from "../rule-tester.js";

const ruleTester = createRuleTester();

ruleTester.run("no-space-in-default-parameters", rule, {
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
          message: "There should be no space before or after = in default parameters"
        }
      ]
    },
    {
      code: "const greet = (name= \"World\") => name;",
      errors: [
        {
          message: "There should be no space before or after = in default parameters"
        }
      ]
    },
    {
      code: "class Greeter { greet(name = \"World\") {} }",
      errors: [
        {
          message: "There should be no space before or after = in default parameters"
        }
      ]
    }
  ]
});
