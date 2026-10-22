import rule from "../../rules/align-consecutive-class-assignements.js";
import createRuleTester from "../rule-tester.js";

const ruleTester = createRuleTester();

ruleTester.run("align-consecutive-class-assignements", rule, {
  valid: [
    "class Example {\n  constructor() {\n    this.a    = 1;\n    this.long = 2;\n  }\n}",
    "class Example {\n  constructor() {\n    this.a = 1;\n\n    this.long = 2;\n  }\n}",
    "class Example {\n  method() {\n    this.a = 1;\n    this.long = 2;\n  }\n}"
  ],

  invalid: [
    {
      code: "class Example {\n  constructor() {\n    this.a = 1;\n    this.long = 2;\n  }\n}",
      errors: [
        {
          message:
            "Assignment of 'this.a' at line 3 column 12 should be aligned at column 15"
        }
      ]
    }
  ]
});
