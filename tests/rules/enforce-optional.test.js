import rule from "../../rules/enforce-optional.js";
import createRuleTester from "../rule-tester.js";

const ruleTester = createRuleTester();

ruleTester.run("enforce-optional", rule, {
  valid: [
    "const result = foo?.bar;",
    "const result = foo && foo.bar !== null;",
    "const result = foo && foo.bar <= maximum;",
    "const result = foo && foo[bar] === value;",
    "if (_header_value && _header_value.length <= ORIGINAL_HEADER_MAX_LENGTH) {}",
    "if (_value instanceof Object && Object.keys(_value).length > 0) {}",
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
