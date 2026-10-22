import rule from "../../rules/no-space-in-optional-arguments.js";
import createRuleTester from "../rule-tester.js";

const ruleTester = createRuleTester();

const ruleWithTokenOffsetCompatibility = {
  ...rule,

  create(context) {
    for (const token of context.sourceCode.tokensAndComments) {
      Object.defineProperties(token, {
        start: {
          value: token.range[0],
          configurable: true
        },
        end: {
          value: token.range[1],
          configurable: true
        }
      });
    }

    return rule.create(context);
  }
};

ruleTester.run("no-space-in-optional-arguments", ruleWithTokenOffsetCompatibility, {
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
