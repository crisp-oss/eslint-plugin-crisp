import rule from "../../rules/vue-props-declaration-multiline.js";
import createRuleTester from "../rule-tester.js";

const ruleTester = createRuleTester();

ruleTester.run("vue-props-declaration-multiline", rule, {
  valid: [
    {
      code: `
        export default {
          props: {
            label: {
              type: String,
              required: true
            }
          }
        };
      `
    },
    {
      code: "export default { props: { enabled: Boolean } };"
    }
  ],

  invalid: [
    {
      code: "export default { props: { label: {type: String, required: true} } };",
      output:
        "export default { props: { label: {\n" +
        "type: String,\n" +
        "required: true\n" +
        "} } };",
      errors: [
        {
          message: "Props should be declared in multiple lines."
        }
      ]
    }
  ]
});
