import rule from "../../rules/jsdoc-description-only.js";
import createRuleTester from "../rule-tester.js";

const ruleTester = createRuleTester();

ruleTester.run("jsdoc-description-only", rule, {
  valid: [
    "/**\n * Restores webpage domain pages (chunked)\n */\nfunction restorePages(payload) {}",
    "class Example {\n  /**\n   * Restores webpage domain pages\n   */\n  async restorePages(payload) {}\n}",
    "/**\n * Links to {@link Other} inline.\n */\nfunction example() {}",
    "/**\n * @property {string} value A property.\n */\nconst object = {};",
    {
      code: "/**\n * Old function\n * @deprecated\n */\nfunction example() {}",
      options: [{ allowedTags: ["deprecated"] }]
    }
  ],

  invalid: [
    {
      code: "/**\n * Determines if animations should be disabled\n * @public\n * @param elementRef Element reference to check visibility\n * @param devices Device types that should trigger animation \\\n *   disable\n */\nexport default function useDisableAnimation(elementRef, devices) {}",
      output: "/**\n * Determines if animations should be disabled\n */\nexport default function useDisableAnimation(elementRef, devices) {}",
      errors: [
        {
          message: "Function JSDoc must only hold a description, remove @public, @param, @param."
        }
      ]
    },
    {
      code: "class Example {\n  /**\n   * Restores pages\n   *\n   * @private\n   */\n  restorePages() {}\n}",
      output: "class Example {\n  /**\n   * Restores pages\n   */\n  restorePages() {}\n}",
      errors: [
        {
          message: "Function JSDoc must only hold a description, remove @private."
        }
      ]
    },
    {
      code: "/**\n * Old function\n * @deprecated\n * @public\n */\nfunction example() {}",
      output: "/**\n * Old function\n * @deprecated\n */\nfunction example() {}",
      options: [{ allowedTags: ["deprecated"] }],
      errors: [
        {
          message: "Function JSDoc must only hold a description, remove @public."
        }
      ]
    },
    {
      code: "/**\n * @public\n */\nconst example = () => {};",
      output: null,
      errors: [
        {
          message: "Function JSDoc must only hold a description, remove @public."
        }
      ]
    }
  ]
});
