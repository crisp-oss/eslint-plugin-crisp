import rule from "../../rules/vue-no-regex-data.js";
import createRuleTester, { withoutFixes } from "../rule-tester.js";

const ruleTester = createRuleTester();

ruleTester.run("vue-no-regex-data", withoutFixes(rule), {
  valid: [
    {
      code: "const pattern = /ok/; export default { data() { return { pattern }; } };"
    },
    {
      code: "export default { data() { return { value: \"text\" }; } };"
    }
  ],

  invalid: [
    {
      code: "export default { data() { return { pattern: /ok/i }; } };",
      errors: [
        {
          message: "Do not use regex in Vue data object. Please move it outside, as a constant."
        }
      ]
    },
    {
      code:
        "export default { data() { return { first: new RegExp(\"a\"), " +
        "second: /b/ }; } };",
      errors: [
        {
          message: "Do not use regex in Vue data object. Please move it outside, as a constant."
        },
        {
          message: "Do not use regex in Vue data object. Please move it outside, as a constant."
        }
      ]
    }
  ]
});
