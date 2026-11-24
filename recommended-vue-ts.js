import pluginTS from "typescript-eslint";

import configRecommendedVue from "./recommended-vue.js";
import configRecommendedTS from "./recommended-ts.js";

const TYPESCRIPT_TYPED_RULES_CONFIGS = [
  "typescript-eslint/strict-type-checked",
  "typescript-eslint/stylistic-type-checked"
];

const TYPESCRIPT_RULES_CONFIGS = [
  "typescript-eslint/strict",
  "typescript-eslint/stylistic"
];

function scopeTypeScriptRules(configs, names, files) {
  return configs.filter((config) => {
    return names.includes(config.name ?? "");
  }).map((config) => {
    return {
      ...config,

      files: files
    };
  });
}

export default function configRecommendedVueTS(pluginCrisp) {
  return [
    ...configRecommendedVue(pluginCrisp),

    ...configRecommendedTS(pluginCrisp).flat().map((config) => {
      return {
        ...config,

        files: ["**/*.ts"]
      };
    }),

    ...scopeTypeScriptRules(
      [
        ...pluginTS.configs.strictTypeChecked,
        ...pluginTS.configs.stylisticTypeChecked
      ],

      TYPESCRIPT_TYPED_RULES_CONFIGS,
      ["**/*.ts"]
    ),

    ...scopeTypeScriptRules(
      [
        ...pluginTS.configs.strict,
        ...pluginTS.configs.stylistic
      ],

      TYPESCRIPT_RULES_CONFIGS,
      ["**/*.vue"]
    ),

    {
      files: ["**/*.ts"],

      languageOptions: {
        parserOptions: {
          tsconfigRootDir: process.cwd()
        }
      },

      rules: {
        // General JS rules
        "no-unused-vars": "off",

        // General JSDoc rules
        "jsdoc/no-types": "error",
        "jsdoc/require-param-type": "off",
        "jsdoc/require-returns-type": "off"
      }
    },

    {
      files: ["**/*.vue"],

      languageOptions: {
        parserOptions: {
          parser: pluginTS.parser
        }
      },

      plugins: {
        "@typescript-eslint": pluginTS.plugin
      },

      rules: {
        // General JS rules
        "no-unused-vars": "off",

        // General JSDoc rules
        "jsdoc/no-types": "error",
        "jsdoc/require-param": "off",
        "jsdoc/require-param-type": "off",
        "jsdoc/require-returns": "off",
        "jsdoc/require-returns-type": "off",

        // Crisp JSDoc rules
        "crisp/jsdoc-align-params": "off",
        "crisp/jsdoc-check-optional-params": "off",

        // General Vue rules
        "vue/block-lang": [
          "error",

          {
            "script": { "lang": "ts" }
          }
        ],
        "vue/component-api-style": [
          "error",
          ["options", "script-setup", "composition"]
        ],
        "vue/require-direct-export": "off"
      }
    },

    {
      files: ["**/*.d.ts"],

      rules: {
        // Crisp JS rules
        "crisp/header-comments-check": "off"
      }
    }
  ];
}
