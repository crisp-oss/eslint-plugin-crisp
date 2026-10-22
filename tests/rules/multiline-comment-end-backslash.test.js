import rule from "../../rules/multiline-comment-end-backslash.js";
import createRuleTester from "../rule-tester.js";

const ruleTester = createRuleTester();
const message = "Multiline comments should end with a backslash '\\', unless they are JSDoc comments.";

ruleTester.run("multiline-comment-end-backslash", rule, {
  valid: [
    {
      code: "// A standalone comment\nconst value = 1;"
    },
    {
      code: "// First line \\\n//   continuation\nconst value = 1;"
    },
    {
      code: "/**\n * JSDoc is exempt.\n */\nfunction run() {}"
    },
    {
      code: "/* First line\n * continuation \\*/\nconst value = 1;"
    }
  ],

  invalid: [
    {
      code: "// First line\n//   continuation\nconst value = 1;",
      errors: [
        {
          message
        }
      ]
    },
    {
      code: "/* First line\n * continuation */\nconst value = 1;",
      errors: [
        {
          message
        }
      ]
    },
    {
      code: "// First\n//   continuation\n// Second\n//   continuation",
      errors: [
        {
          message
        },
        {
          message
        }
      ]
    }
  ]
});
