import rule from "../../rules/methods-ordering.js";
import createRuleTester from "../rule-tester.js";

const ruleTester = createRuleTester();

ruleTester.run("methods-ordering", rule, {
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
        /** @private */
        __first() {}

        // --> NEXT SECTION <--
        /** @public */
        second() {}
      }`
    },
    {
      code: `class Service {
        /** @private */
        __before() {}

        constructor() {}

        /** @public */
        after() {}

        undocumented() {}
      }`
    }
  ],

  invalid: [
    {
      code: `class Service {
        /** @protected */
        _refresh() {}

        /** @public */
        start() {}
      }`,
      errors: [
        {
          message: "Public methods should be defined before protected or private methods."
        }
      ]
    },
    {
      code: `class Service {
        /** @private */
        __reset() {}

        /** @protected */
        _refresh() {}
      }`,
      errors: [
        {
          message: "Protected methods should be defined before private methods."
        }
      ]
    }
  ]
});
