module.exports = {
  env: {
    es6: true,
    node: true
  },

  plugins: [
    "eslint-plugin-jsdoc"
  ],

  extends: [
    "eslint:recommended",
    "plugin:jsdoc/recommended",
    "plugin:vue/vue3-recommended",
    "plugin:vue-pug/vue3-recommended"
  ],

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
    "comma-dangle": ["error", "never"],
    "comma-style": ["error", "last"],
    "curly": "error",
    "computed-property-spacing": ["error", "never"],
    "default-param-last": "error",
    "default-case-last": "error",
    "dot-notation": "error",
    "eqeqeq": "error",
    "eol-last": "error",
    "for-direction": "error",
    "key-spacing": ["error", { "beforeColon": false, "afterColon": true }],
    "linebreak-style": ["error", "unix"],
    "newline-per-chained-call": "error",
    "no-console": "warn",
    "no-debugger": "warn",
    "no-eval": "error",
    "no-multi-str": "error",
    "no-multiple-empty-lines": ["error", { max: 1 }],
    "no-mixed-spaces-and-tabs": "error",
    "no-tabs": "error",
    "no-trailing-spaces": "error",
    "no-unused-vars": "warn",
    "no-unsafe-optional-chaining": "error",
    "object-curly-spacing": ["error", "always"],
    "padded-blocks": ["error", "never"],
    "prefer-arrow-callback": "error",
    "quote-props": ["error", "as-needed"],
    "semi": ["error", "always"],
    "semi-style": ["error", "last"],
    "semi-spacing": ["error", { "before": false, "after": true }],
    "space-before-blocks": "error",
    "space-in-parens": ["error", "never"],

    "brace-style": [
      "error",
      "1tbs",

      {
        "allowSingleLine": true
      }
    ],
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
    "object-curly-newline": [
      "error",

      {
        "multiline": true, "consistent": true
      }
    ],
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
    "quotes": [
      "error",
      "double",

      {
        "avoidEscape": true, "allowTemplateLiterals": true
      }
    ],
    "no-restricted-syntax": [
      "error",

      {
        "selector": "SwitchCase > *.consequent[type!='BlockStatement']",
        "message": "Switch cases without blocks are disallowed."
      },
    ],

    // Crisp JS rules
    "crisp/enforce-optional": "error",
    "crisp/header-check": "error",
    "crisp/header-comments-check": "error",
    "crisp/methods-naming": "error",
    "crisp/methods-ordering": "error",
    "crisp/multiline-comment-end-backslash": "error",
    "crisp/no-async": "error",
    "crisp/no-var-in-blocks": "error",
    "crisp/no-useless-template-literals": "error",
    "crisp/regex-in-constructor": "error",
    "crisp/ternary-parenthesis": "error",
    "crisp/variable-names": "error",

    "crisp/one-space-after-operator": [
      "error",

      {
        "checkColon": false
      }
    ],
    "crisp/no-short-parameters": [
      "error",

      {
        "exceptions": ["_", "$", "x", "y"]
      }
    ],

    // JSDoc rules
    "jsdoc/require-param-description": "off",
    "jsdoc/newline-after-description": "off",
    "jsdoc/require-description": "error",
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

    // General Vue rules
    "vue/component-api-style": ["error", ["options"]],
    "vue/component-name-in-template-casing": ["error", "kebab-case"],
    "vue/component-options-name-casing": ["error", "PascalCase"],
    "vue/custom-event-name-casing": ["error", "camelCase"],
    "vue/html-comment-content-spacing": ["error", "always"],
    "vue/match-component-import-name": "error",
    "vue/new-line-between-multi-line-property": "error",
    "vue/no-bare-strings-in-template": "error",
    "vue/no-multiple-objects-in-class": "error",
    "vue/no-static-inline-styles": "error",
    "vue/no-use-v-else-with-v-for": "error",
    "vue/no-useless-v-bind": "error",
    "vue/padding-line-between-blocks": ["error", "always"],
    "vue/require-direct-export": "error",
    "vue/v-for-delimiter-style": ["error", "in"],
    "vue/comma-dangle": "error",
    "vue/html-quotes": "off",
    "vue/no-v-html": "off",
    "vue/prefer-true-attribute-shorthand": "error",
    "vue/comma-dangle": "error",
    "vue/eqeqeq": "error",
    "vue/key-spacing": ["error", { "beforeColon": false, "afterColon": true }],
    "vue/no-irregular-whitespace": "error",
    "vue/padding-lines-in-component-definition": [
      "error",

      {
        "groupSingleLineProperties": false
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
          ["GLOBAL", "UNIQUE", "OTHER_ATTR"]
        ],
        "alphabetical": false
      }
    ],
    "vue/component-tags-order": [
      "error",

      {
        "order": [ "template", "script", "style" ]
      }
    ],
    "vue/no-mutating-props": [
      "error",

      {
        "shallowOnly": true
      }
    ],
    "vue/v-slot-style": [
      "error",

      {
        "atComponent": "v-slot",
        "default": "v-slot",
        "named": "longform"
      }
    ],

    // Crisp Vue rules
    "crisp/vue-computed-order": "error",
    "crisp/vue-emits-order": "error",
    "crisp/vue-header-check": "error",
    "crisp/vue-html-quotes": "error",
    "crisp/vue-no-regex-data": "error",
    "crisp/vue-props-declaration-order": "error"
  }
}
