import rule from "../../rules/vue-no-name-option.js";
import createRuleTester from "../rule-tester.js";

const ruleTester = createRuleTester();

ruleTester.run("vue-no-name-option", rule, {
  valid: [
    {
      code: "export default defineComponent({ name: \"Utility\" });",
      filename: "/project/utility.js"
    },
    {
      code: "export default defineComponent({ props: {} });",
      filename: "/project/Panel.vue"
    },
    {
      code: "export default { name: \"Legacy\" };",
      filename: "/project/Legacy.vue"
    }
  ],

  invalid: [
    {
      code: "export default defineComponent({ name: \"Panel\", props: {} });",
      filename: "/project/Panel.vue",
      output: "export default defineComponent({  props: {} });",
      errors: [
        {
          message: "Vue single-file components must rely on their inferred filename."
        }
      ]
    },
    {
      code: "export default Vue.defineComponent({ props: {}, \"name\": \"Panel\" });",
      filename: "/project/Panel.vue",
      output: "export default Vue.defineComponent({ props: {} });",
      errors: [
        {
          message: "Vue single-file components must rely on their inferred filename."
        }
      ]
    }
  ]
});
