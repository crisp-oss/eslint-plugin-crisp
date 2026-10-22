import rule from "../../rules/no-short-parameters.js";
import createRuleTester from "../rule-tester.js";

const ruleTester = createRuleTester();

ruleTester.run("no-short-parameters", rule, {
  valid: [
    "function map(value, index) {}",
    "const map = ({ x }, [y]) => x + y;",
    {
      code: "const map = (x, i) => x + i;",
      options: [
        {
          exceptions: ["x", "i"]
        }
      ]
    }
  ],

  invalid: [
    {
      code: "function map(x) {}",
      errors: [
        {
          message: "Parameter name 'x' is too short."
        }
      ]
    },
    {
      code: "const map = function(a, value) {};",
      errors: [
        {
          message: "Parameter name 'a' is too short."
        }
      ]
    },
    {
      code: "class Mapper { map(x, y) {} }",
      errors: [
        {
          message: "Parameter name 'x' is too short."
        },
        {
          message: "Parameter name 'y' is too short."
        }
      ]
    },
    {
      code: "const map = (x, y) => x + y;",
      options: [
        {
          exceptions: ["x"]
        }
      ],
      errors: [
        {
          message: "Parameter name 'y' is too short."
        }
      ]
    }
  ]
});
