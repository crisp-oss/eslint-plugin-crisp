import rule from "../../rules/vue-watch-handler.js";
import createRuleTester from "../rule-tester.js";

const ruleTester = createRuleTester();

ruleTester.run("vue-watch-handler", rule, {
  valid: [
    {
      code: `
        export default {
          watch: {
            ready: { handler() {} },
            value: { handler(value) {} },
            item: { handler(newValue, oldValue) {} }
          }
        };
      `
    },
    {
      code: `
        export default {
          watch: {
            value: {
              immediate: true,
              handler: (value) => {}
            }
          }
        };
      `
    },
    {
      code: "const options = { observe: { value(value) {} } };"
    },
    {
      code: "const options = { watch: { value(value) {} } };"
    }
  ],

  invalid: [
    {
      code: "export default { watch: { value(value) {} } };",
      errors: [
        {
          messageId: "objectForm"
        }
      ]
    },
    {
      code: "export default { watch: { value: { immediate: true } } };",
      errors: [
        {
          messageId: "missingHandler"
        }
      ]
    },
    {
      code: "export default { watch: { value: { handler: \"onValue\" } } };",
      errors: [
        {
          messageId: "invalidHandler"
        }
      ]
    },
    {
      code: "export default { watch: { value: { handler(current, previous) {} } } };",
      errors: [
        {
          messageId: "invalidSignature"
        }
      ]
    },
    {
      code: "export default defineComponent({ watch: { value(value) {} } });",
      errors: [
        {
          messageId: "objectForm"
        }
      ]
    },
    {
      code: "export default { \"watch\": { value(value) {} } };",
      errors: [
        {
          messageId: "objectForm"
        }
      ]
    }
  ]
});
