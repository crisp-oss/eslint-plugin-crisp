import rule from "../../rules/vue-computed-order.js";
import createRuleTester from "../rule-tester.js";

const ruleTester = createRuleTester();

ruleTester.run("vue-computed-order", rule, {
  valid: [
    {
      code: "export default { computed: { alpha() {}, beta() {} } };"
    },
    {
      code: "const options = { computed: { beta() {}, alpha() {} } };"
    }
  ],

  invalid: [
    {
      code: "export default { computed: { beta() {}, alpha() {} } };",
      output: "export default { computed: { alpha() {}, beta() {} } };",
      errors: [
        {
          message: "Computed properties should be in alphabetical order."
        }
      ]
    }
  ]
});
