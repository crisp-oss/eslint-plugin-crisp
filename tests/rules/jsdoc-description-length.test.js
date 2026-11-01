import rule from "../../rules/jsdoc-description-length.js";
import createRuleTester from "../rule-tester.js";

const ruleTester = createRuleTester();

ruleTester.run("jsdoc-description-length", rule, {
  valid: [
    "/**\n * A single-line description.\n */\nfunction example() {}",
    "/**\n * A description that continues \\\n *   on the next line.\n * @returns {boolean} The result.\n */\nfunction example() { return true; }",
    {
      code: "/**\n * First line \\\n *   second line \\\n *   third line.\n */\nfunction example() {}",
      options: [
        {
          maxLines: 3
        }
      ]
    },
    "/********************\n * Section header\n ********************/\nconst value = true;"
  ],

  invalid: [
    {
      code: "/**\n * First line \\\n *   second line \\\n *   third line.\n */\nfunction example() {}",
      errors: [
        {
          message: "JSDoc description must not exceed 2 line(s)."
        }
      ]
    },
    {
      code: "/**\n * First line\n *   second line.\n */\nfunction example() {}",
      errors: [
        {
          message: "Multi-line JSDoc description must end with '\\' before each continuation."
        }
      ]
    },
    {
      code: "/**\n * First line \\\n * second line.\n */\nfunction example() {}",
      errors: [
        {
          message: "Continuation lines in JSDoc description must be indented with 3 spaces after '*'."
        }
      ]
    },
    {
      code: "/**\n * First line \\\n *   second line.\n */\nfunction example() {}",
      options: [
        {
          maxLines: 1
        }
      ],
      errors: [
        {
          message: "JSDoc description must not exceed 1 line(s)."
        }
      ]
    }
  ]
});
