import rule from "../../rules/vue-props-declaration-line-break.js";
import createRuleTester from "../rule-tester.js";

const ruleTester = createRuleTester();

ruleTester.run("vue-props-declaration-line-break", rule, {
  valid: [
    {
      code: `
        export default {
          props: {
            items: {
              type: Array,

              default: function() { return []; }
            }
          }
        };
      `
    },
    {
      code: "export default { props: { items: { type: Array, default: () => [] } } };"
    }
  ],

  invalid: [
    {
      code:
        "export default { props: { items: { type: Array, " +
        "default: function() { return []; } } } };",
      output:
        "export default { props: { items: { type: Array,\n\n" +
        "default: function() { return []; } } } };",
      errors: [
        {
          message:
            "There should be a line break between 'type' and 'default' " +
            "function in prop definition."
        }
      ]
    },
    {
      code: `export default {
  props: {
    items: {
      type: Array, default: function() { return []; }
    }
  }
};`,
      output: `export default {
  props: {
    items: {
      type: Array,

      default: function() { return []; }
    }
  }
};`,
      errors: [
        {
          message:
            "There should be a line break between 'type' and 'default' " +
            "function in prop definition."
        }
      ]
    }
  ]
});
