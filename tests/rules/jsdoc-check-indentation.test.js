import rule from "../../rules/jsdoc-check-indentation.js";
import createRuleTester from "../rule-tester.js";

const ruleTester = createRuleTester();

ruleTester.run("jsdoc-check-indentation", rule, {
  valid: [
    "/**\n * A description.\n * @returns {boolean} The result.\n */\nfunction check() { return true; }",
    "/**\n * ```js\n *  const indented = true;\n * ```\n */\nfunction example() {}",
    "/**\n * @example\n *  const indented = true;\n */\nfunction example() {}",
    {
      code: "/**\n * @custom\n *  deliberately indented\n */\nfunction example() {}",
      options: [
        {
          excludeTags: ["custom"]
        }
      ]
    },
    "/**\n * A continued line \\\n *   remains part of the description.\n */\nfunction example() {}"
  ],

  invalid: [
    {
      code: "/**\n *  Unexpected indentation.\n */\nfunction example() {}",
      errors: [
        {
          message: "There must be no indentation."
        }
      ]
    },
    {
      code: "/**\n * @example\n *  const indented = true;\n */\nfunction example() {}",
      options: [
        {
          excludeTags: []
        }
      ],
      errors: [
        {
          message: "There must be no indentation."
        }
      ]
    }
  ]
});
