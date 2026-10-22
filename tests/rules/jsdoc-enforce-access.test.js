import rule from "../../rules/jsdoc-enforce-access.js";
import createRuleTester from "../rule-tester.js";

const ruleTester = createRuleTester();

ruleTester.run("jsdoc-enforce-access", rule, {
  valid: [
    "/** @public */\nfunction publicFunction() {}",
    "class Example {\n  /** @protected */\n  method() {}\n}",
    "const object = {\n  /** @private */\n  method: () => {}\n};",
    "/** @internal */\nconst internal = function() {};",
    "function undocumented() {}"
  ],

  invalid: [
    {
      code: "/** A function. */\nfunction example() {}",
      errors: [
        {
          message: "JSDoc comment should contain @public, @protected, @private or @internal"
        }
      ]
    },
    {
      code: "class Example {\n  /** A method. */\n  method() {}\n}",
      errors: [
        {
          message: "JSDoc comment should contain @public, @protected, @private or @internal"
        }
      ]
    },
    {
      code: "const object = {\n  /** A property method. */\n  method: () => {}\n};",
      errors: [
        {
          message: "JSDoc comment should contain @public, @protected, @private or @internal"
        }
      ]
    },
    {
      code: "const expression = /** A function expression. */ function() {};",
      errors: [
        {
          message: "JSDoc comment should contain @public, @protected, @private or @internal"
        }
      ]
    }
  ]
});
