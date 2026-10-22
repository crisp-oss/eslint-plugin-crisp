import rule from "../../rules/vue-emits-order.js";
import createRuleTester from "../rule-tester.js";

const ruleTester = createRuleTester();

ruleTester.run("vue-emits-order", rule, {
  valid: [
    {
      code: "export default { emits: [\"close\", \"open\"] };"
    },
    {
      code: "const options = { emits: [\"open\", \"close\"] };"
    }
  ],

  invalid: [
    {
      code: "export default { emits: [\"open\", \"close\"] };",
      output: "export default { emits: [\"close\", \"open\"] };",
      errors: [
        {
          message: "Emits should be in alphabetical order."
        }
      ]
    }
  ]
});
