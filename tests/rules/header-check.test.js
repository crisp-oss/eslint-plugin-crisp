import rule from "../../rules/header-check.js";
import createRuleTester from "../rule-tester.js";

const ruleTester = createRuleTester();

ruleTester.run("header-check", rule, {
  valid: [
    {
      code:
        "/*\n * This file is part of Example\n *\n" +
        " * Copyright (c) 2026 Crisp IM SAS\n" +
        " * All rights belong to Crisp IM SAS\n */\nconst VALUE = 1;",
      filename: "/project/example.js"
    },
    {
      code: "/* Custom header */\nconst VALUE = 1;",
      filename: "/project/example.ts",
      options: [
        {
          patterns: [" Custom header "]
        }
      ]
    },
    {
      code: "const VALUE = 1;",
      filename: "/project/example.txt"
    }
  ],

  invalid: [
    {
      code: "const VALUE = 1;",
      filename: "/project/example.js",
      errors: [
        {
          message: "File must start with the proper header."
        }
      ]
    },
    {
      code: "/* Wrong header */\nconst VALUE = 1;",
      filename: "/project/example.ts",
      options: [
        {
          patterns: [" Expected header "]
        }
      ],
      errors: [
        {
          message: "File must start with the proper header."
        }
      ]
    },
    {
      code: "const VALUE = 1;",
      filename: "/project/example.js",
      options: [
        {
          patterns: ["["]
        }
      ],
      errors: [
        {
          message: "File must start with the proper header."
        }
      ]
    }
  ]
});
