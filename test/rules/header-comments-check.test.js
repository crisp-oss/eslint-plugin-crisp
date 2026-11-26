import rule from "../../rules/header-comments-check.js";
import createRuleTester from "../rule-tester.js";

const ruleTester = createRuleTester();
const header = (name) => [
  "/**************************************************************************",
  ` * ${name}`,
  " ***************************************************************************/"
].join("\n");

ruleTester.run("header-comments-check", rule, {
  valid: [
    {
      filename: "/project/src/example.js",
      code: `${header("IMPORTS")}\n\nimport value from "package";`
    },
    {
      filename: "/project/src/example.ts",
      code: `${header("CONSTANTS")}\n\nconst MAX_RETRIES = 3;\n\n${header("INSTANCES")}\n\nconst pattern = /value/;`
    },
    {
      filename: "/project/src/example.js",
      code:
        `${header("TYPES")}\n\n/** @typedef {string} Identifier */\n\n` +
        `${header("EXPORTS")}\n\nexport default {};`
    },
    {
      filename: "/project/src/example.js",
      code: "export default {};"
    },
    {
      filename: "/project/src/example.js",
      code: `${header("MIXIN TO MANAGE HANDOFF")}\n\nexport default {};`
    },
    {
      filename: "/project/src/example.js",
      code:
        `${header("IMPORTS")}\n\nimport first from "first";\n` +
        "import second from \"second\";"
    },
    {
      filename: "/project/src/example.vue",
      code: "import value from \"package\";\nconst MAX_RETRIES = 3;"
    },
    {
      filename: "/project/src/example.js",
      code: "function wrapper() {\n  const LOCAL_CONSTANT = 1;\n}"
    }
  ],

  invalid: [
    {
      filename: "/project/src/example.js",
      code: "import value from \"package\";",
      errors: [
        {
          message: "Import group must be preceded by a 'IMPORTS' comment block"
        }
      ]
    },
    {
      filename: "/project/src/example.ts",
      code: "const MAX_RETRIES = 3;",
      errors: [
        {
          message: "Variable group must be preceded by a 'CONSTANTS' comment block"
        }
      ]
    },
    {
      filename: "/project/src/example.js",
      code: "const patterns = [/first/, /second/];",
      errors: [
        {
          message: "Regex group must be preceded by a 'INSTANCES' comment block"
        }
      ]
    },
    {
      filename: "/project/src/example.js",
      code: "/** @typedef {string} Identifier */\nconst value = 1;",
      errors: [
        {
          message: "Type comments group must be preceded by a 'TYPES' comment block"
        }
      ]
    },
    {
      filename: "/project/src/example.js",
      code: `${header("CONSTANTS")}\nconst MAX_RETRIES = 3;`,
      output: `${header("CONSTANTS")}\n\nconst MAX_RETRIES = 3;`,
      errors: [
        {
          message: "Header comment block must be followed by a blank line"
        }
      ]
    },
    {
      filename: "/project/src/example.js",
      code: `${header("IMPORTS")}\n// NPM\nimport value from "package";`,
      output: `${header("IMPORTS")}\n\n// NPM\nimport value from "package";`,
      errors: [
        {
          message: "Header comment block must be followed by a blank line"
        }
      ]
    }
  ]
});
