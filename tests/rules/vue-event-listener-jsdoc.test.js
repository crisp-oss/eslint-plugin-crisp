import rule from "../../rules/vue-event-listener-jsdoc.js";
import { createVueRuleTester } from "../rule-tester.js";

const ruleTester = createVueRuleTester();

ruleTester.run("vue-event-listener-jsdoc", rule, {
  valid: [
    {
      code: "export default { methods: {} };"
    },
    {
      code: `
        export default {
          methods: {
            // --> HELPERS <--
            /**
             * Handles formatting
             */
            format() {}
          }
        };
      `
    },
    {
      code: `
        export default {
          methods: {
            // --> EVENT LISTENERS <--
            /**
             * Triggers on load more
             * @public
             * @param {object} $state
             */
            onLoadMore($state) {}
          }
        };
      `
    },
    {
      code: `
        export default defineComponent({
          methods: {
            // --> ACTIONS <--
            /**
             * Saves content
             */
            save() {},
            // --> HELPERS <--
            /**
             * Formats content
             */
            format() {},
            // --> EVENT LISTENERS <--
            /**
             * Triggers on save
             */
            onSave() {},
            /**
             * Triggers on close
             */
            onClose: function() {}
          }
        });
      `
    },
    {
      filename: "Component.vue",
      code: `
        <script>
        export default defineComponent({
          methods: {
            // --> EVENT LISTENERS <--
            /**
             * Triggers on load more
             * @public
             */
            onLoadMore() {
              this.loadMore(() => {
                /**
                 * Handles a nested callback
                 */
                return true;
              });
            }
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
            // --> EVENT LISTENERS <--
            /**
             * Handles load more
             * @public
             */
            onLoadMore() {}
          }
        };
      `,
      errors: [
        {
          messageId: "invalidDescription"
        }
      ]
    },
    {
      code: `
        export default {
          methods: {
            // --> EVENT LISTENERS <--
            onLoadMore() {}
          }
        };
      `,
      errors: [
        {
          messageId: "missingJsdoc"
        }
      ]
    },
    {
      code: `
        export default {
          methods: {
            // --> EVENT LISTENERS <--
            /**
             * Triggers on
             * @public
             */
            onLoadMore() {}
          }
        };
      `,
      errors: [
        {
          messageId: "invalidDescription"
        }
      ]
    },
    {
      filename: "Component.vue",
      code: `
        <script>
        export default defineComponent({
          methods: {
            // --> EVENT LISTENERS <--
            /**
             * Triggers when content is saved
             * @public
             */
            onSave() {},
            /**
             * Triggers on close
             * @public
             */
            onClose() {}
          }
        });
        </script>
      `,
      errors: [
        {
          messageId: "invalidDescription"
        }
      ]
    }
  ]
});
