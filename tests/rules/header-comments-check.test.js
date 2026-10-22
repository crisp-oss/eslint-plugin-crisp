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
      code: `${header("IMPORTS")}\nimport value from "package";`
    },
    {
      filename: "/project/src/example.ts",
      code: `${header("CONSTANTS")}\nconst MAX_RETRIES = 3;\n\n${header("INSTANCES")}\nconst pattern = /value/;`
    },
    {
      filename: "/project/src/example.js",
      code:
        `${header("TYPES")}\n/** @typedef {string} Identifier */\n\n` +
        `${header("EXPORTS")}\nexport default {};`
    },
    {
      filename: "/project/src/example.js",
      code:
        `${header("IMPORTS")}\nimport first from "first";\n` +
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
      code: "export default {};",
      errors: [
        {
          message: "Export group must be preceded by a 'EXPORTS' comment block"
        }
      ]
    }
  ]
});
