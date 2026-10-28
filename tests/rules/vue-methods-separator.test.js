import rule from "../../rules/vue-methods-separator.js";
import { createVueRuleTester } from "../rule-tester.js";

const ruleTester = createVueRuleTester();

ruleTester.run("vue-methods-separator", rule, {
  valid: [
    {
      code: "export default { methods: {} };"
    },
    {
      code: `
        export default {
          methods: {
            // --> ACTIONS <--
            save() {}
          }
        };
      `
    },
    {
      code: `
        export default {
          methods: {
            // --> HELPERS <--
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
            onSave() {}
          }
        };
      `
    },
    {
      code: `
        export default {
          methods: {
            // --> ACTIONS <--
            save() {},
            // --> EVENT LISTENERS <--
            onSave() {}
          }
        };
      `
    },
    {
      code: `
        export default defineComponent({
          methods: {
            // --> ACTIONS <--
            save() {},
            // --> HELPERS <--
            format() {},
            // --> EVENT LISTENERS <--
            onSave() {}
          }
        });
      `
    },
    {
      code: `
        export default {
          options: {
            methods: {
              save() {}
            }
          }
        };
      `
    },
    {
      code: `
        export default {
          methods: {
            // --> ACTIONS <--
            save() {
              // --> EVENT LISTENERS <--
              const status = "saved";

              return status;
            },
            // --> HELPERS <--
            format() {}
          }
        };
      `
    },
    {
      filename: "Component.vue",
      code: `
        <template><div /></template>
        <script>
        export default defineComponent({
          methods: {
            // --> ACTIONS <--
            save() {},
            // --> HELPERS <--
            format() {},
            // --> EVENT LISTENERS <--
            onSave() {}
          }
        });
        </script>
      `
    }
  ],

  invalid: [
    {
      code: "export default { methods: { save() {} } };",
      errors: [
        {
          messageId: "missingSeparator"
        }
      ]
    },
    {
      code: `
        export default {
          methods: {
            // --> HELPERS <--
            help() {},
            // --> OTHER <--
            run() {}
          }
        };
      `,
      errors: [
        {
          messageId: "invalidSeparator"
        }
      ]
    },
    {
      code: `
        export default {
          methods: {
            // --> HELPERS <--
            format() {},
            // --> ACTIONS <--
            save() {}
          }
        };
      `,
      errors: [
        {
          messageId: "unorderedSeparator"
        }
      ]
    },
    {
      code: `
        export default {
          methods: {
            // --> ACTIONS <--
            save() {},
            // --> ACTIONS <--
            publish() {}
          }
        };
      `,
      errors: [
        {
          messageId: "duplicateSeparator",
          data: { separator: "--> ACTIONS <--" }
        }
      ]
    },
    {
      code: `
        export default defineComponent({
          methods: {
            // --> EVENT LISTENERS <--
            onSave() {},
            // --> HELPERS <--
            format() {}
          }
        });
      `,
      errors: [
        {
          messageId: "unorderedSeparator"
        }
      ]
    },
    {
      code: `
        export default {
          methods: {
            save() {
              // --> ACTIONS <--
            }
          }
        };
      `,
      errors: [
        {
          messageId: "missingSeparator"
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
            onSave() {},
            // --> ACTIONS <--
            save() {}
          }
        });
        </script>
      `,
      errors: [
        {
          messageId: "unorderedSeparator"
        }
      ]
    }
  ]
});
