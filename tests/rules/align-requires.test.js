import rule from "../../rules/align-requires.js";
import createRuleTester from "../rule-tester.js";

const ruleTester = createRuleTester({
  languageOptions: {
    sourceType: "commonjs"
  }
});

ruleTester.run("align-requires", rule, {
  valid: [
    "const alpha = require(\"alpha\"),\n      beta = require(\"beta\");",
    "const alpha = require(\"alpha\");\nconst beta = require(\"beta\");",
    "const alpha = require(\"alpha\"), value = 1,\n        beta = require(\"beta\");"
  ],

  invalid: [
    {
      code: "const alpha = require(\"alpha\"),\n       beta = require(\"beta\");",
      errors: [
        {
          message: "Misaligned require statement."
        }
      ]
    }
  ]
});
