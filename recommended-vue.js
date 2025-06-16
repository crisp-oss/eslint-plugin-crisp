import globals from "globals";
import pluginJS from "@eslint/js";
// import pluginJSdoc from "eslint-plugin-jsdoc";
import pluginVue from "eslint-plugin-vue";
import pluginVuePug from "eslint-plugin-vue-pug";

export default function configRecommendedVue(plugin) {
  return [
    pluginJS.configs.recommended,
    // pluginJSdoc.configs["flat/recommended"],
    pluginVue.configs["flat/recommended"],
    pluginVuePug.configs["flat/recommended"],

    {
      languageOptions: {
        globals: {
          ...globals.browser,
          ...globals.node
        }
      },

      plugins: {
        // "jsdoc": pluginJSdoc,
        "crisp": plugin
      },


      settings: {
        jsdoc: {
          tagNamePreference: {
            returns: "return"
          },

          preferredTypes: {
            Function: "function",
            Array: "array",
            Map: "map",
            Integer: "number"
          }
        }
      },

      rules: {
        // General JS rules
        "arrow-parens": ["error", "always"],
        "brace-style": [
          "error",
          "1tbs",

          {
            "allowSingleLine": true
          }
        ],
        "comma-dangle": ["error", "never"],
        "comma-spacing": ["error", { "before": false, "after": true }],
        "comma-style": ["error", "last"],
        "curly": "error",
        "computed-property-spacing": ["error", "never"],
        "default-param-last": "error",
        "default-case-last": "error",
        "dot-notation": "error",
        "eqeqeq": "error",
        "eol-last": "error",
        "for-direction": "error",
        "indent": [
          "error",
          2,

          {
            "SwitchCase": 1,
            "FunctionDeclaration": {
              "parameters": "off"
            },
            "FunctionExpression": {
              "parameters": "off"
            },
            "CallExpression": {
              "arguments": "off"
            },
            "VariableDeclarator": 1,
            "outerIIFEBody": 0,
            "ArrayExpression": 1,
            "ObjectExpression": 1,
            "ImportDeclaration": 1,
            "flatTernaryExpressions": false,
            "offsetTernaryExpressions": true
          }
        ],
        "key-spacing": ["error", { "beforeColon": false, "afterColon": true }],
        "keyword-spacing": "error",
        "linebreak-style": ["error", "unix"],
        "newline-per-chained-call": "error",
        "no-console": "warn",
        "no-debugger": "warn",
        "no-eval": "error",
        "no-multi-str": "error",
        "no-multiple-empty-lines": ["error", { max: 1 }],
        "no-mixed-spaces-and-tabs": "error",
        "no-restricted-syntax": [
          "error",

          {
            "selector": "SwitchCase > *.consequent[type!='BlockStatement']",
            "message": "Switch cases without braces are disallowed."
          }
        ],
        "no-tabs": "error",
        "no-trailing-spaces": "error",
        "no-undef": "error",
        "no-unused-vars": "warn",
        "no-unsafe-optional-chaining": "error",
        "object-curly-newline": [
          "error",

          {
            "multiline": true, "consistent": true
          }
        ],
        "object-curly-spacing": ["error", "always"],
        "padded-blocks": ["error", "never"],
        "padding-line-between-statements": [
          "error",

          { "blankLine": "always", "prev": "let", "next": "*" },
          { "blankLine": "any", "prev": "let", "next": "let" },
          { "blankLine": "always", "prev": "const", "next": "*" },
          { "blankLine": "any", "prev": "const", "next": "const" },
          { "blankLine": "always", "prev": "block-like", "next": "*" },
          { "blankLine": "always", "prev": "*", "next": "break" },
          { "blankLine": "any", "prev": "empty", "next": "break" },
          { "blankLine": "always", "prev": "*", "next": "block-like" },
          { "blankLine": "any", "prev": "case", "next": "case" },
          { "blankLine": "always", "prev": "continue", "next": "*" },
          { "blankLine": "always", "prev": "break", "next": "*" }
        ],
        "prefer-arrow-callback": "error",
        "quotes": [
          "error",
          "double",

          {
            "avoidEscape": true, "allowTemplateLiterals": true
          }
        ],
        "quote-props": ["error", "as-needed"],
        "semi": ["error", "always"],
        "semi-style": ["error", "last"],
        "semi-spacing": ["error", { "before": false, "after": true }],
        "space-before-blocks": "error",
        "space-in-parens": ["error", "never"],
        "space-infix-ops": "error",

        // Crisp JS rules
        "crisp/align-comments": "error",
        "crisp/enforce-optional": "error",
        "crisp/header-check": "error",
        "crisp/header-comments-check": "error",
        "crisp/import-group-comment": "error",
        "crisp/import-group-order": "error",
        "crisp/methods-naming": "error",
        "crisp/methods-ordering": "error",
        "crisp/multiline-comment-end-backslash": "error",
        "crisp/newline-after-switch-case": "error",
        "crisp/no-async": "error",
        "crisp/no-extra-line-within-function": "error",
        "crisp/no-short-parameters": [
          "error",

          {
            "exceptions": ["_", "$", "x", "y"]
          }
        ],
        "crisp/no-useless-template-literals": "error",
        "crisp/no-var-in-blocks": "error",
        "crisp/one-space-after-operator": [
          "error",

          {
            "checkColon": false
          }
        ],
        "crisp/regex-in-constructor": "error",
        "crisp/ternary-parenthesis": "error",
        "crisp/variable-names": "error",

        // General JSDoc rules
        "jsdoc/require-description": "error",
        "jsdoc/require-param-description": "off",
        "jsdoc/require-jsdoc": [
          "error",

          {
            "require": {
              "FunctionDeclaration": true,
              "MethodDefinition": true,
              "ClassDeclaration": true,
              "ArrowFunctionExpression": false,
              "FunctionExpression": false
            },

            "contexts": [
              "Property[key.name=\"getters\"] > ObjectExpression > Property",
              "Property[key.name=\"methods\"] > ObjectExpression > Property"
            ]
          }
        ],
        "jsdoc/sort-tags": [
          "error",

          {
            "tagSequence": [
              {
                "tags": [
                  "private",
                  "protected",
                  "public",

                  "class",

                  "classdesc",

                  "param",
                  "return"
                ]
              }
            ]
          }
        ],

        // Crisp JSDoc rules
        "crisp/jsdoc-align-params": "error",
        "crisp/jsdoc-check-indentation": "error",
        "crisp/jsdoc-check-optional-params": "error",
        "crisp/jsdoc-enforce-access": "error",
        "crisp/jsdoc-enforce-classdesc": "error",
        "crisp/jsdoc-require-description-uppercase": "error",

        // General Vue rules
        "vue/attributes-order": [
          "error",

          {
            "order": [
              "RENDER_MODIFIERS",
              "CONDITIONALS",
              "OTHER_DIRECTIVES",
              "LIST_RENDERING",
              "SLOT",
              "TWO_WAY_BINDING",
              "CONTENT",
              "EVENTS",
              "DEFINITION",
              "ATTR_DYNAMIC",
              "ATTR_STATIC",
              "ATTR_SHORTHAND_BOOL"
            ],
            "alphabetical": false
          }
        ],
        "vue/block-lang": [
          "error",

          {
            "script": { "allowNoLang": true }
          }
        ],
        "vue/block-order": [
          "error",

          {
            "order": ["template", "script", "style"]
          }
        ],
        "vue/block-tag-newline": [
          "error",

          {
            "singleline": "always",
            "multiline": "always",
            "maxEmptyLines": 0
          }
        ],
        "vue/comma-dangle": "error",
        "vue/component-api-style": ["error", ["options"]],
        "vue/component-name-in-template-casing": ["error", "kebab-case"],
        "vue/component-options-name-casing": ["error", "PascalCase"],
        "vue/custom-event-name-casing": [
          "error",
          "camelCase",

          {
            "ignores": [
              "/^[a-z]+(?:-[a-z]+)*(?::[a-z]+(?:-[a-z]+)*)*$/i"
            ]
          }
        ],
        "vue/eqeqeq": "error",
        "vue/html-comment-content-spacing": ["error", "always"],
        "vue/html-quotes": "off",
        "vue/key-spacing": [
          "error",

          {
            "beforeColon": false,
            "afterColon": true
          }
        ],
        "vue/match-component-import-name": "error",
        "vue/max-len": [
          "error",

          {
            "code": 80,
            "template": 999,
            "ignorePattern": "^import|\`(.+?)\`|\/\\*\\* \@type|\@return \\{|\\*{20,}",
            "ignoreStrings": true,
            "ignoreUrls": true,
            "ignoreRegExpLiterals": true
          }
        ],
        "vue/new-line-between-multi-line-property": "error",
        "vue/no-bare-strings-in-template": "error",
        "vue/no-irregular-whitespace": "error",
        "vue/no-multiple-objects-in-class": "error",
        "vue/no-mutating-props": [
          "error",

          {
            "shallowOnly": true
          }
        ],
        "vue/no-static-inline-styles": "error",
        "vue/no-use-v-else-with-v-for": "error",
        "vue/no-useless-v-bind": "error",
        "vue/no-v-html": "off",
        "vue/padding-line-between-blocks": ["error", "always"],
        "vue/padding-lines-in-component-definition": [
          "error",

          {
            "groupSingleLineProperties": false
          }
        ],
        "vue/prefer-true-attribute-shorthand": "error",
        "vue/require-direct-export": "error",
        "vue/v-for-delimiter-style": ["error", "in"],
        "vue/v-slot-style": [
          "error",

          {
            "atComponent": "v-slot",
            "default": "v-slot",
            "named": "longform"
          }
        ],

        // Crisp Vue rules
        "crisp/vue-attribute-comma": "error",
        "crisp/vue-attribute-linebreak": "error",
        "crisp/vue-computed-order": "error",
        "crisp/vue-emits-order": "error",
        "crisp/vue-header-check": "error",
        "crisp/vue-html-indent": "error",
        "crisp/vue-html-quotes": "error",
        "crisp/vue-no-regex-data": "error",
        "crisp/vue-props-declaration-line-break": "error",
        "crisp/vue-props-declaration-multiline": "error",
        "crisp/vue-props-declaration-order": "error",
        "crisp/vue-ref-case": "error"
      }
    }
  ];
}
