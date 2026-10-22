import rule from "../../rules/enforce-optional.js";
import createRuleTester from "../rule-tester.js";

const ruleTester = createRuleTester();

ruleTester.run("enforce-optional", rule, {
  valid: [
    "const result = foo?.bar;",
    "const result = foo && foo.bar !== null;",
    "const keys = Object.keys(foo || {});",
    "const filtered = (foo || []).filter(Boolean);"
  ],

  invalid: [
    {
      code: "const result = foo && foo.bar;",
      errors: [
        {
          message: /Prefer using optional chaining rather than/
        }
      ]
    }
  ]
});
