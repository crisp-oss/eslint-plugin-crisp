import rule from "../../rules/vue-define-component.js";
import createRuleTester from "../rule-tester.js";

const ruleTester = createRuleTester();

ruleTester.run("vue-define-component", rule, {
  valid: [
    {
      code: "export default { name: \"Utility\" };",
      filename: "/project/utility.js"
    },
    {
      code: "export default defineComponent({});",
      filename: "/project/Panel.vue"
    },
    {
      code: "export default { name: \"Index\" };",
      filename: "/project/mixins/index.js"
    }
  ],

  invalid: [
    {
      code: "import { ref } from \"vue\";\nexport default { setup() { return { ref }; } };",
      filename: "/project/Panel.vue",
      output:
        "import { ref, defineComponent } from \"vue\";\n" +
        "export default defineComponent({ setup() { return { ref }; } });",
      errors: [
        {
          message: "Mixins and components must use the `defineComponent` wrapper."
        }
      ]
    },
    {
      code: "export default createOptions();",
      filename: "/project/mixins/shared.js",
      errors: [
        {
          message: "Mixins and components must use the `defineComponent` wrapper."
        }
      ]
    }
  ]
});
