import rule from "../../rules/vue-props-declaration-order.js";
import createRuleTester from "../rule-tester.js";

const ruleTester = createRuleTester();

ruleTester.run("vue-props-declaration-order", rule, {
  valid: [
    {
      code: "export default { props: { alpha: String, beta: Boolean } };"
    },
    {
      code: "const options = { props: { beta: Boolean, alpha: String } };"
    }
  ],

  invalid: [
    {
      code: "export default { props: { beta: Boolean, alpha: String } };",
      output: "export default { props: { alpha: String, beta: Boolean } };",
      errors: [
        {
          message: "Props should be in alphabetical order."
        }
      ]
    }
  ]
});
