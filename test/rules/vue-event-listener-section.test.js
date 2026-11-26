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

            /**
             * Saves content
             */
            save() {},

            /**
             * Triggers on save
             */
            onSave() {}
          }
        };
      `,
      output: `
        export default {
          methods: {
            // --> ACTIONS <--

            /**
             * Saves content
             */
            save() {},

            // --> EVENT LISTENERS <--

            /**
             * Triggers on save
             */
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

            format() {},

            onLoadMore() {}
          }
        };
      `,
      output: `
        export default {
          methods: {
            // --> HELPERS <--

            format() {},

            // --> EVENT LISTENERS <--

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
      output: `
        export default {
          methods: {
            // --> EVENT LISTENERS <--

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

            save() {},

            onSave() {},
            // --> HELPERS <--

            format() {},

            onFormatComplete() {},
            // --> EVENT LISTENERS <--

            onClose() {}
          }
        });
        </script>
      `,
      output: `
        <script>
        export default defineComponent({
          methods: {
            // --> ACTIONS <--

            save() {},

            // --> HELPERS <--

            format() {},

            // --> EVENT LISTENERS <--

            onClose() {},

            onSave() {},

            onFormatComplete() {}
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
