import rule from "../../rules/vue-event-listener-section.js";
import { createVueRuleTester } from "../rule-tester.js";

const ruleTester = createVueRuleTester();

ruleTester.run("vue-event-listener-section", rule, {
  valid: [
    {
      code: "export default { methods: {} };"
    },
    {
      code: `
        export default {
          methods: {
            // --> ACTIONS <--
            save() {},
            // --> HELPERS <--
            onlyOnce() {},
            onload() {},
            on_save() {},
            on2Factor() {}
          }
        };
      `
    },
    {
      code: `
        export default defineComponent({
          methods: {
            // --> EVENT LISTENERS <--
            onSave() {},
            onURLChange() {},
            "onClose"() {}
          }
        });
      `
    },
    {
      code: `
        export default {
          methods: {
            // --> HELPERS <--
            createHandlers() {
              return {
                onSave() {}
              };
            }
          }
        };
      `
    },
    {
      filename: "Component.vue",
      code: `
        <script>
        export default defineComponent({
          methods: {
            // --> ACTIONS <--
            save() {},
            // --> EVENT LISTENERS <--
            onLoadMore() {}
          }
        });
        </script>
      `
    }
  ],

  invalid: [
    {
      code: `
        export default {
          methods: {
            // --> ACTIONS <--
            onSave() {}
          }
        };
      `,
      errors: [
        {
          messageId: "wrongSection",
          data: { name: "onSave" }
        }
      ]
    },
    {
      code: `
        export default {
          methods: {
            // --> HELPERS <--
            onLoadMore() {}
          }
        };
      `,
      errors: [
        {
          messageId: "wrongSection",
          data: { name: "onLoadMore" }
        }
      ]
    },
    {
      code: `
        export default {
          methods: {
            "onClose": function() {}
          }
        };
      `,
      errors: [
        {
          messageId: "wrongSection",
          data: { name: "onClose" }
        }
      ]
    },
    {
      filename: "Component.vue",
      code: `
        <script>
        export default defineComponent({
          methods: {
            // --> ACTIONS <--
            onSave() {},
            // --> HELPERS <--
            onFormatComplete() {},
            // --> EVENT LISTENERS <--
            onClose() {}
          }
        });
        </script>
      `,
      errors: [
        {
          messageId: "wrongSection",
          data: { name: "onSave" }
        },
        {
          messageId: "wrongSection",
          data: { name: "onFormatComplete" }
        }
      ]
    }
  ]
});
