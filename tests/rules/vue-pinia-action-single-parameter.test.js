import rule from "../../rules/vue-pinia-action-single-parameter.js";
import createRuleTester from "../rule-tester.js";

const ruleTester = createRuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: "module"
  }
});

ruleTester.run("vue-pinia-action-single-parameter", rule, {
  valid: [
    {
      code: `
        import { defineStore } from "pinia";

        const useStore = defineStore("example", {
          actions: {
            reset() {},
            setValue(value) {},
            updateValue({ id, value }) {},
            updatePair([id, value]) {},
            setOptionalValue(value = null) {}
          }
        });
      `
    },
    {
      code: `
        import { defineStore } from "pinia";

        defineStore("example", {
          actions: {
            reset: function() {},
            setValue: function(value) {},
            updateValue: ({ id, value }) => {},
            updatePair: ([id, value]) => {},
            setOptionalValue: (value = null) => {}
          }
        });
      `
    },
    {
      code: `
        import { defineStore as definePiniaStore } from "pinia";

        definePiniaStore("example", {
          "actions": {
            reset() {},
            setValue(value) {}
          }
        });
      `
    },
    {
      code: `
        import { defineStore } from "pinia";

        function outside(first, second) {}

        defineStore("example", {
          state: (first, second) => ({}),
          getters: {
            combined(first, second) {}
          },
          actions: {
            run(payload) {
              return function nested(first, second) {};
            }
          }
        });
      `
    },
    {
      code: `
        import { defineStore } from "pinia";

        const unrelated = {
          actions: {
            update(first, second) {},
            forward(...args) {}
          }
        };
      `
    },
    {
      code: `
        import { defineStore } from "pinia";

        const useStore = defineStore("example", (first, second) => {
          function nested(third, fourth) {}

          return {};
        });
      `
    },
    {
      code: `
        import { defineStore } from "another-package";

        defineStore("example", {
          actions: {
            update(first, second) {}
          }
        });
      `
    },
    {
      code: `
        import pinia, { defineStore as importedDefineStore } from "pinia";

        function wrapper(importedDefineStore) {
          importedDefineStore("example", {
            actions: {
              update(first, second) {}
            }
          });
        }

        pinia.defineStore("example", {
          actions: {
            update(first, second) {}
          }
        });
      `
    },
    {
      code: `
        import { defineStore } from "pinia";

        const actions = {
          update(first, second) {}
        };

        defineStore("example", { actions });
      `
    }
  ],

  invalid: [
    {
      code: `
        import { defineStore } from "pinia";

        defineStore("example", {
          actions: {
            updateValue(id, value) {}
          }
        });
      `,
      errors: [
        {
          messageId: "singlePayloadArgument"
        }
      ]
    },
    {
      code: `
        import { defineStore } from "pinia";

        defineStore("example", {
          actions: {
            updateOther: function(id, value) {}
          }
        });
      `,
      errors: [
        {
          messageId: "singlePayloadArgument"
        }
      ]
    },
    {
      code: `
        import { defineStore } from "pinia";

        defineStore("example", {
          actions: {
            updateArrow: (id, value) => {}
          }
        });
      `,
      errors: [
        {
          messageId: "singlePayloadArgument"
        }
      ]
    },
    {
      code: `
        import { defineStore } from "pinia";

        defineStore("example", {
          actions: {
            forwardArguments(...args) {}
          }
        });
      `,
      errors: [
        {
          messageId: "singlePayloadArgument"
        }
      ]
    },
    {
      code: `
        import { defineStore as definePiniaStore } from "pinia";

        definePiniaStore("example", {
          actions: {
            updateMethod(id, value) {},
            updateFunction: function(id, value, extra) {},
            updateArrow: (id, value = null) => {},
            forward: (...args) => {}
          }
        });
      `,
      errors: [
        {
          messageId: "singlePayloadArgument"
        },
        {
          messageId: "singlePayloadArgument"
        },
        {
          messageId: "singlePayloadArgument"
        },
        {
          messageId: "singlePayloadArgument"
        }
      ]
    }
  ]
});
