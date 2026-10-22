import rule from "../../rules/vue-methods-separator.js";
import createRuleTester from "../rule-tester.js";

const ruleTester = createRuleTester();

ruleTester.run("vue-methods-separator", rule, {
  valid: [
    {
      code: "export default { methods: {} };"
    },
    {
      code: `
        export default {
          methods: {
            // --> ACTIONS <--
            save() {}
          }
        };
      `
    }
  ],

  invalid: [
    {
      code: "export default { methods: { save() {} } };",
      errors: [
        {
          message:
            "Methods block must contain at least one separator comment: " +
            "'// --> ACTIONS <--', '// --> HELPERS <--', " +
            "or '// --> EVENT LISTENERS <--'."
        }
      ]
    },
    {
      code: `
        export default {
          methods: {
            // --> HELPERS <--
            help() {},
            // --> OTHER <--
            run() {}
          }
        };
      `,
      errors: [
        {
          message:
            "Invalid separator comment. Must be '// --> ACTIONS <--', " +
            "'// --> HELPERS <--', or '// --> EVENT LISTENERS <--'."
        }
      ]
    }
  ]
});
