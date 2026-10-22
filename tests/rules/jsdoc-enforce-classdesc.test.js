import rule from "../../rules/jsdoc-enforce-classdesc.js";
import createRuleTester from "../rule-tester.js";

const ruleTester = createRuleTester();

ruleTester.run("jsdoc-enforce-classdesc", rule, {
  valid: [
    "/**\n * @classdesc Represents an example.\n */\nclass Example {}",
    "class Undocumented {}",
    "/** A factory function. */\nfunction createExample() {}"
  ],

  invalid: [
    {
      code: "/** Represents an example. */\nclass Example {}",
      errors: [
        {
          message: "JSDoc class header should include @classdesc"
        }
      ]
    },
    {
      code: "/**\n * @classdesc\n */\nclass Example {}",
      errors: [
        {
          message: "The @classdesc tag in JSDoc class header should have a non-empty description"
        }
      ]
    },
    {
      code: "/**\n * @classdesc   \n */\nclass Example {}",
      errors: [
        {
          message: "The @classdesc tag in JSDoc class header should have a non-empty description"
        }
      ]
    }
  ]
});
