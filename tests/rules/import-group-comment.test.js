import rule from "../../rules/import-group-comment.js";
import createRuleTester from "../rule-tester.js";

const ruleTester = createRuleTester();

ruleTester.run("import-group-comment", rule, {
  valid: [
    {
      filename: "/project/src/example.js",
      code: "// NPM\nimport lodash from \"lodash\";"
    },
    {
      filename: "/project/src/components/example.js",
      code: "// PROJECT: COMPONENTS\nimport Button from \"./Button.js\";"
    },
    {
      filename: "/project/src/example.js",
      code: "// PROJECT: HELPERS\n// @ts-ignore\nimport helper from \"@/helpers/helper.js\";"
    },
    {
      filename: "/project/src/example.js",
      options: [{ "^virtual:": "GENERATED" }],
      code: "// PROJECT: GENERATED\nimport value from \"virtual:value\";"
    },
    {
      filename: "/project/src/Component.vue",
      code: "// TYPES\n/** @typedef {string} Identifier */"
    },
    {
      code: "// PROJECT: MAIN\nimport value from \"./value.js\";"
    },
    {
      code: "// NPM\nimport value from \"package\";",
      options: [{ "[": "INVALID" }]
    }
  ],

  invalid: [
    {
      filename: "/project/src/example.js",
      code: "// PROJECT: HELPERS\nimport lodash from \"lodash\";",
      errors: [
        {
          message: "Import \"lodash\" should be in the \"NPM\" group."
        }
      ]
    },
    {
      filename: "/project/src/example.js",
      code: "// NPM\n\nimport lodash from \"lodash\";",
      output: "// NPM\nimport lodash from \"lodash\";",
      errors: [
        {
          message: "Import group comment must be immediately followed by an import (no blank line)."
        }
      ]
    },
    {
      filename: "/project/src/example.js",
      options: [{ "^virtual:": "GENERATED" }],
      code: "// NPM\nimport value from \"virtual:value\";",
      errors: [
        {
          message: "Import \"virtual:value\" should be in the \"PROJECT: GENERATED\" group."
        }
      ]
    },
    {
      filename: "/project/src/Component.vue",
      code: "/** @typedef {string} Identifier */",
      errors: [
        {
          message: "Type comments group must be preceded by a '// TYPES' comment"
        }
      ]
    },
    {
      filename: "/project/src/Component.vue",
      code: "// TYPES\n\n/** @typedef {string} Identifier */",
      output: "// TYPES\n/** @typedef {string} Identifier */",
      errors: [
        {
          message: "Type group comment must be immediately followed by a type comment (no blank line)."
        }
      ]
    }
  ]
});
