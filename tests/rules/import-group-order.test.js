import rule from "../../rules/import-group-order.js";
import createRuleTester from "../rule-tester.js";

const ruleTester = createRuleTester();

ruleTester.run("import-group-order", rule, {
  valid: [
    {
      code: [
        "// NPM",
        "import lodash from \"lodash\";",
        "// PROJECT: COMPONENTS",
        "import Button from \"@/components/Button.js\";",
        "// PROJECT: HELPERS",
        "import helper from \"@/helpers/helper.js\";",
        "// TYPES",
        "import \"./types.js\";"
      ].join("\n")
    },
    {
      code: "// PROJECT: UNKNOWN\nimport value from \"./value.js\";"
    },
    {
      code: "import first from \"first\";\nimport second from \"second\";"
    }
  ],

  invalid: [
    {
      code: [
        "// PROJECT: HELPERS",
        "import helper from \"@/helpers/helper.js\";",
        "// NPM",
        "import lodash from \"lodash\";"
      ].join("\n"),
      errors: [
        {
          message: "Import group 'NPM' should be before 'PROJECT: HELPERS' group."
        }
      ]
    },
    {
      code: [
        "// NPM",
        "import lodash from \"lodash\";",
        "// TYPES",
        "import \"./types.js\";",
        "// PROJECT: COMPONENTS",
        "import Button from \"@/components/Button.js\";"
      ].join("\n"),
      errors: [
        {
          message: "Import group 'PROJECT: COMPONENTS' should be after 'NPM' group."
        }
      ]
    }
  ]
});
