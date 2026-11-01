import rule from "../../rules/constructor-variables.js";
import createRuleTester from "../rule-tester.js";

const ruleTester = createRuleTester();

ruleTester.run("constructor-variables", rule, {
  valid: [
    "class Example {\n  constructor() {\n    this._value = 1;\n  }\n}",
    {
      code: "class Example {\n  constructor() {\n    this.value = 1;\n  }\n}",
      options: [
        {
          variableExceptions: ["value"]
        }
      ]
    },
    {
      code: "class Example {\n  constructor() {\n    this.value = 1;\n  }\n}",
      filename: "/project/special-file.js",
      options: [
        {
          filenameExceptions: ["special-file.js"]
        }
      ]
    },
    "class Example {\n  method() {\n    this.value = 1;\n  }\n}",
    "class Example {\n  constructor() {\n    this[\"_value\"] = 1;\n  }\n}",
    "class Example {\n  constructor() {\n    this[propertyName] = 1;\n  }\n}"
  ],

  invalid: [
    {
      code: "class Example {\n  constructor() {\n    this.value = 1;\n  }\n}",
      filename: "/project/example.js",
      errors: [
        {
          message:
            "Class properties in the constructor should start with '_', except for specified exceptions"
        }
      ]
    },
    {
      code: "class Example {\n  constructor() {\n    this[\"value\"] = 1;\n  }\n}",
      errors: [
        {
          message:
            "Class properties in the constructor should start with '_', except for specified exceptions"
        }
      ]
    }
  ]
});
