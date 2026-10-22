import rule from "../../rules/no-async.js";
import createRuleTester from "../rule-tester.js";

const ruleTester = createRuleTester();
const message = "async/await is not allowed, use Promises instead.";

ruleTester.run("no-async", rule, {
  valid: [
    {
      code: "function load() { return Promise.resolve(); }"
    },
    {
      code: "const load = () => Promise.resolve();"
    },
    {
      code: "class Service { load() { return Promise.resolve(); } }"
    }
  ],

  invalid: [
    {
      code: "async function load() {}",
      errors: [
        {
          message
        }
      ]
    },
    {
      code: "const load = async () => {};",
      errors: [
        {
          message
        }
      ]
    },
    {
      code: "const load = async function() {};",
      errors: [
        {
          message
        }
      ]
    },
    {
      code: "class Service { async load() {} }",
      errors: [
        {
          message
        },
        {
          message
        }
      ]
    }
  ]
});
