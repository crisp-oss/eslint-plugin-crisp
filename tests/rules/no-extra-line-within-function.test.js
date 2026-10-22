import rule from "../../rules/no-extra-line-within-function.js";
import createRuleTester, { withoutFixes } from "../rule-tester.js";

const ruleTester = createRuleTester();
const message = "Expected at most one line break between declarations within a function.";
const reportOnlyRule = withoutFixes(rule);

ruleTester.run("no-extra-line-within-function", reportOnlyRule, {
  valid: [
    {
      code: `function run() {
  const first = 1;

  const second = 2;
}`
    },
    {
      code: `const run = function() {
  first();
  second();
};`
    },
    {
      code: "const run = () => value;"
    },
    {
      code: "const first = 1;\n\n\nconst second = 2;"
    }
  ],

  invalid: [
    {
      code: `function run() {
  const first = 1;


  const second = 2;
}`,
      errors: [
        {
          message
        }
      ]
    },
    {
      code: `const run = function() {
  first();


  second();
};`,
      errors: [
        {
          message
        }
      ]
    },
    {
      code: `const run = () => {
  first();



  second();
};`,
      errors: [
        {
          message
        }
      ]
    }
  ]
});
