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

  rules: {
    // General JS rules
    "no-eval": "error",
    "no-console": "warn",
    "no-debugger": "warn",
    "no-unused-vars": "warn",
    "arrow-parens": ["error", "always"],
    "comma-dangle": ["error", "never"],
    "curly": ["error", "all"],
    "computed-property-spacing": ["error", "never"],
    "default-param-last": "error",
    "default-case-last": "error",
    "dot-notation": "error",
    "eqeqeq": "error",
    "linebreak-style": ["error", "unix"],
    "no-multiple-empty-lines": ["error", { max: 1 }],
    "no-trailing-spaces": "error",
    "no-tabs": "error",
    "object-curly-spacing": ["error", "always"],
    "prefer-arrow-callback": "error",
    "semi": ["error", "always"],
    "semi-style": ["error", "last"],
    "semi-spacing": ["error", { "before": false, "after": true }],
    "space-before-blocks": ["error", "always"],
    "space-in-parens": ["error", "never"],
    "padding-line-between-statements": [
      "error",

      { blankLine: "always", prev: "let", next: "*" },
      { blankLine: "any", prev: "let", next: "let" },
      { blankLine: "always", prev: "const", next: "*" },
      { blankLine: "any", prev: "const", next: "const" },
      { blankLine: "always", prev: "block-like", next: "*" },
      { blankLine: "always", prev: "*", next: "break" },
      { blankLine: "any", prev: "empty", next: "break" },
      { blankLine: "always", prev: "*", next: "block-like" },
      { blankLine: "any", prev: "case", next: "case" },
      { blankLine: "always", prev: "continue", next: "*" },
      { blankLine: "always", prev: "break", next: "*" }
    ],
    "quotes": [
      "error",
      "double",

      { "avoidEscape": true, "allowTemplateLiterals": true }
    ],

    // Crisp JS rules
    "crisp/header-check": "error",
    "crisp/header-comments-check": "error",
    "crisp/methods-naming": "error",
    "crisp/methods-ordering": "error",
    "crisp/multiline-comment-end-backslash": "error",
    "crisp/no-async": "error",
    "crisp/no-var-in-blocks": "error",
    "crisp/no-useless-template-literals": "error",
    "crisp/one-space-after-operator": ["error", { "checkColon": false }],
    "crisp/regex-in-constructor": "error",
    "crisp/ternary-parenthesis": "error",
    "crisp/variable-names": "error",
    "crisp/no-short-parameters": [
      "error",

      {
        exceptions: ["_", "$", "x", "y"]
      }
    ],

    // JSDoc rules
    "jsdoc/require-param-description": "off",
    "jsdoc/newline-after-description": "off",
    "jsdoc/require-jsdoc": [
      "error",

      {
        require: {
          FunctionDeclaration: true,
          MethodDefinition: true,
          ClassDeclaration: true,
          ArrowFunctionExpression: false,
          FunctionExpression: false
        }
      }
    ],
    "jsdoc/sort-tags": [
      "error",

      {
        tagSequence: [
          {
            tags: [
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
    "vue/html-quotes": "off",
    "vue/no-v-html": "off",
    "vue/prefer-true-attribute-shorthand": "error",
    "vue/attributes-order": [
      "error",

      {
        order: [
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
  },

  settings: {
    jsdoc: {
      tagNamePreference: {
        returns: "return"
      },

      preferredTypes: {
        Function: "function",
        Array: "array",
        Integer: "number"
      }
    }
  }
}
