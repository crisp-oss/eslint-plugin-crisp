import rule from "../../rules/methods-naming.js";
import createRuleTester from "../rule-tester.js";

const ruleTester = createRuleTester();

ruleTester.run("methods-naming", rule, {
  valid: [
    {
      code: `class Service {
        /** @public */
        start() {}

        /** @protected */
        _refresh() {}

        /** @private */
        __reset() {}
      }`
    },
    {
      code: `class Service {
        undocumented() {}

        /** A method without a visibility tag. */
        documented() {}
      }`
    },
    {
      code: `class Service {
        /** @private */
        ["computed"]() {}
      }`
    }
  ],

  invalid: [
    {
      code: "class Service {\n  /** @public */\n  __reset() {}\n}",
      errors: [
        {
          message: "Methods starting with '__' should not be marked with '@public'."
        }
      ]
    },
    {
      code: "class Service {\n  /** @public */\n  _refresh() {}\n}",
      errors: [
        {
          message: "Methods starting with '_' should not be marked with '@public'."
        }
      ]
    },
    {
      code: "class Service {\n  /** @private */\n  reset() {}\n}",
      errors: [
        {
          message: "Methods not starting with '__' should not be marked with '@private'."
        }
      ]
    },
    {
      code: "class Service {\n  /** @protected */\n  refresh() {}\n}",
      errors: [
        {
          message: "Methods not starting with '_' should not be marked with '@protected'."
        }
      ]
    }
  ]
});
