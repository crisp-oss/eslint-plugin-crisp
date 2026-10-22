import rule from "../../rules/no-inline-function-in-ternary.js";
import createRuleTester from "../rule-tester.js";

const ruleTester = createRuleTester();

ruleTester.run("no-inline-function-in-ternary", rule, {
  valid: [
    {
      code: "const callback = enabled ? onEnabled : onDisabled;"
    },
    {
      code: "const result = predicate(() => true) ? yes : no;"
    },
    {
      code: "const callback = () => enabled ? yes : no;"
    },
    {
      code: "items.map((item) => item.value);"
    }
  ],

  invalid: [
    {
      code: "const callback = enabled ? () => run() : fallback;",
      errors: [
        {
          messageId: "inlineFunction"
        }
      ]
    },
    {
      code: "const callback = enabled ? fallback : function() { run(); };",
      errors: [
        {
          messageId: "inlineFunction"
        }
      ]
    },
    {
      code: "const callback = enabled ? wrap(() => run()) : fallback;",
      errors: [
        {
          messageId: "inlineFunction"
        }
      ]
    },
    {
      code: "const callback = enabled ? () => run() : function() { stop(); };",
      errors: [
        {
          messageId: "inlineFunction"
        },
        {
          messageId: "inlineFunction"
        }
      ]
    }
  ]
});
