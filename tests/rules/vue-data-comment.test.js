import rule from "../../rules/vue-data-comment.js";
import createRuleTester from "../rule-tester.js";

const ruleTester = createRuleTester();

ruleTester.run("vue-data-comment", rule, {
  valid: [
    {
      code: `
        export default {
          data() {
            return {
              // --> STATE <--
              ready: false
            };
          }
        };
      `
    },
    {
      code: "export default { data() { return {}; } };"
    }
  ],

  invalid: [
    {
      code: "export default { data() { return { ready: false }; } };",
      errors: [
        {
          message:
            "data() return object must start with a comment: " +
            "'// --> STATE <--', '// --> DATA <--', " +
            "'// --> ROUTE PARAMS <--', '// --> ROUTE QUERY <--', or " +
            "'// --> COMPONENTS <--'."
        }
      ]
    },
    {
      code: `
        export default {
          data() {
            return {
              // --> DATA <--
              value: 1,
              // --> UNKNOWN <--
              other: 2
            };
          }
        };
      `,
      errors: [
        {
          message:
            "Invalid comment. Must be '// --> STATE <--', " +
            "'// --> DATA <--', '// --> ROUTE PARAMS <--', " +
            "'// --> ROUTE QUERY <--', or '// --> COMPONENTS <--'."
        }
      ]
    }
  ]
});
