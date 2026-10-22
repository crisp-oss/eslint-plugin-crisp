import rule from "../../rules/const.js";
import createRuleTester from "../rule-tester.js";

const ruleTester = createRuleTester();

ruleTester.run("const", rule, {
  valid: [
    "const MAXIMUM = 10;",
    "const client = createClient();",
    "const callback = () => true;",
    "function example() {\n  const __CACHE = 1;\n}",
    {
      code: "function example() {\n  const cache = 1;\n}",
      options: [
        {
          exceptions: ["cache"]
        }
      ]
    },
    "export const publicValue = 1;"
  ],

  invalid: [
    {
      code: "const value = 1;",
      errors: [
        {
          message:
            "Consts should be uppercase and defined at the top level or be replaced with let _variable (Crisp convention)."
        }
      ]
    },
    {
      code: "function example() {\n  const _cache = 1;\n}",
      output: "function example() {\n  let _cache = 1;\n}",
      errors: [
        {
          message: "Local variables prefixed with \"_\" should use \"let\"."
        }
      ]
    },
    {
      code: "function example() {\n  const value = 1;\n}",
      errors: [
        {
          message:
            "Consts should be uppercase and defined at the top level or be replaced with let _variable (Crisp convention)."
        }
      ]
    }
  ]
});
