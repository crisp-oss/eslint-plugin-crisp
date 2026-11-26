import tseslint from "typescript-eslint";

import rule from "../../rules/no-underscore-prefix.js";
import createRuleTester, { createVueRuleTester } from "../rule-tester.js";

const ruleTester = createRuleTester({
  languageOptions: {
    parser: tseslint.parser
  }
});

function error(name) {
  return {
    message: `Declaration '${name}' must not start with an underscore.`
  };
}

ruleTester.run("no-underscore-prefix", rule, {
  valid: [
    "const flagId = getFlagId();",
    "items.forEach((_) => {});",
    "import { _internal } from \"module\";",
    "const object = { _id: 1 };",
    "const { _id: id } = document;",
    "class Example { #value = 1; }",
    "console.log(__dirname, _global);",
    "const __dirname = dirname(fileURLToPath(import.meta.url));\nconst __filename = fileURLToPath(import.meta.url);"
  ],

  invalid: [
    {
      code: "const _flagId = getFlagId();",
      errors: [error("_flagId")]
    },
    {
      code: "function _useABTesting(): void {}\nexport default createSharedComposable(_useABTesting);",
      errors: [error("_useABTesting")]
    },
    {
      code: "function example(_value: string, __count: number) {}",
      errors: [error("_value"), error("__count")]
    },
    {
      code: "const { _id } = document;\nlet [_first] = items;",
      errors: [error("_id"), error("_first")]
    },
    {
      code: "try {} catch (_error) {}",
      errors: [error("_error")]
    },
    {
      code: "class _Example {\n  _value = 1;\n\n  _compute(): void {}\n}",
      errors: [error("_Example"), error("_value"), error("_compute")]
    },
    {
      code: "type _Value = string;\ninterface _Options {}\nenum _Kind {}",
      errors: [error("_Value"), error("_Options"), error("_Kind")]
    }
  ]
});

const vueRuleTester = createVueRuleTester({
  languageOptions: {
    parserOptions: {
      parser: tseslint.parser
    }
  }
});

const VUE_OPTIONS = [
  {
    onlyVueTypeScript: true
  }
];

vueRuleTester.run("no-underscore-prefix (onlyVueTypeScript)", rule, {
  valid: [
    {
      code: "<script>\nfunction example() { let _result = 1; }\n</script>",
      filename: "/project/Panel.vue",
      options: VUE_OPTIONS
    },
    {
      code: "function example() { let _result = 1; }",
      filename: "/project/utility.js",
      options: VUE_OPTIONS
    }
  ],

  invalid: [
    {
      code: "<script lang=\"ts\">\nfunction example(): void { let _result = 1; }\n</script>",
      filename: "/project/Panel.vue",
      options: VUE_OPTIONS,
      errors: [error("_result")]
    }
  ]
});
