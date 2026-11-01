import rule from "../../rules/vue-no-multiline-object-shorthand.js";
import createRuleTester from "../rule-tester.js";
import vueParser from "vue-eslint-parser";

const ruleTester = createRuleTester();

ruleTester.run("vue-no-multiline-object-shorthand", rule, {
  valid: [
    "this.removeFeedAlertLocal({ feedAlertId });",
    "const payload = { section, locale };",
    "call(\n  { feedAlertId }\n);",
    "const payload = {\n  section: section,\n  method() {}\n};",
    "export default {\n  base,\n  form\n};",
    "defineComponent({ components: {\n  ContentNavigate\n} });",
    "defineComponent({ 'components': {\n  ContentNavigate\n} });",
    "const { section } = payload;",
    "const payload = {\n  ...other\n};",
    {
      filename: "example.vue",
      languageOptions: { parser: vueParser },
      code: "<script>export default { methods: { remove() { this.removeFeedAlertLocal({ feedAlertId }); } } };</script>"
    }
  ],

  invalid: [
    {
      code: "this.removeFeedAlertLocal({\n  feedAlertId\n});",
      errors: [{ messageId: "explicitProperty" }]
    },
    {
      code: "const payload = {\n  section, locale\n};",
      errors: [
        { messageId: "explicitProperty" },
        { messageId: "explicitProperty" }
      ]
    },
    {
      code: "export default { nested: {\n  value\n} };",
      errors: [{ messageId: "explicitProperty" }]
    },
    {
      code: "defineComponent({ components: { nested: {\n  value\n} } });",
      errors: [{ messageId: "explicitProperty" }]
    },
    {
      code: "defineComponent({ data() { return {\n  value\n}; } });",
      errors: [{ messageId: "explicitProperty" }]
    },
    {
      code: "const payload = { [components]: {\n  value\n} };",
      errors: [{ messageId: "explicitProperty" }]
    },
    {
      filename: "example.vue",
      languageOptions: { parser: vueParser },
      code: "<script>export default { methods: { remove() { this.removeFeedAlertLocal({\n  feedAlertId\n}); } } };</script>",
      errors: [{ messageId: "explicitProperty" }]
    }
  ]
});
