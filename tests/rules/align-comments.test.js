import rule from "../../rules/align-comments.js";
import createRuleTester, { withoutFixes } from "../rule-tester.js";

const ruleTester = createRuleTester();

ruleTester.run("align-comments", withoutFixes(rule), {
  valid: [
    "// A top-level value\nconst value = 1;",
    "function example() {\n  // Return the value\n  return true;\n}",
    "const previous = 1; // Keep this inline\nconst next = 2;",
    "const callback = () => {\n  // Invoke the callback\n  callback();\n};"
  ],

  invalid: [
    {
      code: "function example() {\n// Misaligned\n  return true;\n}",
      errors: [
        {
          message: "Comment should be aligned with the next line."
        }
      ]
    }
  ]
});
