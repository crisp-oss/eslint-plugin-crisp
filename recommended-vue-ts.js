import pluginTS from "typescript-eslint";

import configRecommendedVue from "./recommended-vue.js";
import configRecommendedTS from "./recommended-ts.js";

// typescript-eslint rules blocks applied to TypeScript files (type-aware)
const TYPESCRIPT_TYPED_RULES_CONFIGS = [
  "typescript-eslint/strict-type-checked",
  "typescript-eslint/stylistic-type-checked"
];

// typescript-eslint rules blocks applied to Vue files (typed linting cannot \
//   parse Vue SFCs, whose types are checked by 'vue-tsc')
const TYPESCRIPT_RULES_CONFIGS = [
  "typescript-eslint/strict",
  "typescript-eslint/stylistic"
];

/**
 * Keeps only the named typescript-eslint rules blocks, scoped to some files
 * Notice: only the rules blocks are kept, as the base blocks would replace \
 *   the Vue parser
 */
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

    // Crisp's TypeScript configuration targets all files: restrict it to \
    //   TypeScript files
    ...configRecommendedTS(pluginCrisp).flat().map((config) => {
      return {
        ...config,

        files: ["**/*.ts"]
      };
    }),

    // Strict TypeScript rules: type-aware rules for TypeScript files, and \
    //   rules that do not need type information for Vue files
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

    // TypeScript files
    {
      files: ["**/*.ts"],

      // Resolve the TypeScript project from the current working directory \
      //   (Crisp's TypeScript configuration resolves it from the plugin \
      //   directory; override 'tsconfigRootDir' if needed)
      languageOptions: {
        parserOptions: {
          tsconfigRootDir: process.cwd()
        }
      },

      rules: {
        // '@typescript-eslint/no-unused-vars' covers unused variables
        "no-unused-vars": "off",

        // Types are carried by TypeScript, never by JSDoc
        "jsdoc/require-param-type": "off",
        "jsdoc/require-returns-type": "off",
        "jsdoc/no-types": "error"
      }
    },

    // Vue files: TypeScript parsing and rules
    {
      files: ["**/*.vue"],

      // Parse TypeScript scripts ('<script lang="ts">')
      languageOptions: {
        parserOptions: {
          parser: pluginTS.parser
        }
      },

      // Register the typescript-eslint plugin, as its base block is not used
      plugins: {
        "@typescript-eslint": pluginTS.plugin
      },

      rules: {
        // '@typescript-eslint/no-unused-vars' covers unused variables, and \
        //   JSDoc carries no types (these Crisp rules expect typed '@param' \
        //   tags)
        "no-unused-vars": "off",
        "jsdoc/require-param": "off",
        "jsdoc/require-returns": "off",
        "crisp/jsdoc-align-params": "off",
        "crisp/jsdoc-check-optional-params": "off",

        // Vue scripts are written in TypeScript
        "vue/block-lang": [
          "error",

          {
            script: {
              lang: "ts"
            }
          }
        ],
        "vue/component-api-style": [
          "error",
          ["options", "script-setup", "composition"]
        ],
        "vue/require-direct-export": "off",

        // Types are carried by TypeScript, never by JSDoc
        "jsdoc/require-param-type": "off",
        "jsdoc/require-returns-type": "off",
        "jsdoc/no-types": "error"
      }
    },

    // Declaration files declare modules ('declare module "..." {}'), whose \
    //   indented imports and exports cannot match the 'IMPORTS' and \
    //   'EXPORTS' comment block format (which only fits top-level statements)
    {
      files: ["**/*.d.ts"],

      rules: {
        "crisp/header-comments-check": "off"
      }
    }
  ];
}
