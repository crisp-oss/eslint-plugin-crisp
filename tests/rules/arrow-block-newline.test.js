import rule from "../../rules/arrow-block-newline.js";
import createRuleTester from "../rule-tester.js";

const ruleTester = createRuleTester();

ruleTester.run("arrow-block-newline", rule, {
  valid: [
    "const callback = () => {};",
    "const callback = () => {\n  return true;\n};",
    "const callback = () => true;"
  ],

  invalid: [
    {
      code: "const callback = () => { return true;\n};",
      errors: [
        {
          messageId: "expectedNewline"
        }
      ]
    }
  ]
});
