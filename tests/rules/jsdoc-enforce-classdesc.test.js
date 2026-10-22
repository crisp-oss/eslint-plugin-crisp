import rule from "../../rules/jsdoc-enforce-classdesc.js";
import createRuleTester from "../rule-tester.js";

const ruleTester = createRuleTester();

ruleTester.run("jsdoc-enforce-classdesc", rule, {
  valid: [
    "/**\n * @classdesc Represents an example.\n */\nclass Example {}",
    "/**\n * @classdesc Represents an example.\n */\nexport default class Example {}",
    "class Undocumented {}",
    "/* Represents an example. */\nclass Example {}",
    "/** Represents an unrelated value. */\nconst value = 1;\nclass Example {}",
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
      code: "/** Represents an example. */\nexport class Example {}",
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
