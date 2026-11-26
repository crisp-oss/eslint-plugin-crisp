import rule from "../../rules/consecutive-line-comments.js";
import createRuleTester from "../rule-tester.js";

const ruleTester = createRuleTester();

const lines = (...values) => values.join("\n");

ruleTester.run("consecutive-line-comments", rule, {
  valid: [
    lines("// First line \\", "//   second line", "const value = 1;"),
    lines("// First comment", "// Second comment", "const value = 1;"),
    lines("// eslint-disable-next-line no-console", "console.log(\"value\");"),
    lines("// Intro \\", "// Important: separate block", "const value = 1;")
  ],

  invalid: [
    {
      code: lines("// First line \\", "// Second line", "const value = 1;"),
      output: lines("// First line \\", "//   Second line", "const value = 1;"),
      errors: [
        {
          messageId: "format"
        }
      ]
    }
  ]
});
