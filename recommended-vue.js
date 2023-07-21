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
    "plugin:vue/vue3-recommended"
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

    // JSDoc rules
    "jsdoc/require-param-description": "off",
    "jsdoc/newline-after-description": "off",
    "jsdoc/check-indentation": "error",
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
    "crisp/jsdoc-check-optional-params": "error",
    "crisp/jsdoc-enforce-access": "error",
    "crisp/jsdoc-enforce-classdesc": "error",
    "crisp/jsdocs-align-params": "error",

    // General Vue rules
    "vue/multi-word-component-names": "error",
    "vue/no-v-html": "off",
    "vue/attributes-order": [
      "error",
      {
        order: [
          "OTHER_DIRECTIVES",
          "CONDITIONALS",
          "LIST_RENDERING",
          "RENDER_MODIFIERS",
          "SLOT",
          "TWO_WAY_BINDING",
          "CONTENT",
          "EVENTS",
          "GLOBAL",
          "DEFINITION",
          "UNIQUE",
          "OTHER_ATTR"
          ["ATTR_DYNAMIC", "ATTR_STATIC", "ATTR_SHORTHAND_BOOL"]
        ],
        "alphabetical": false
      }
    ],

    // Crisp JS rules
    "crisp/header-check": "error",
    "crisp/header-comments-check": "error",
    "crisp/methods-naming": "error",
    "crisp/multiline-comment-end-backslash": "error",
    "crisp/no-async": "error",
    "crisp/no-var-in-blocks": "error",
    "crisp/no-useless-template-literals": "error",
    "crisp/one-space-after-operator": ["error", { "checkColon": false }],
    "crisp/regex-in-constructor": "error",
    "crisp/variable-names": "error",
    "crisp/no-short-parameters": [
      "error",

      {
        exceptions: ["_", "$", "x", "y"]
      }
    ],

    // Crisp Vue rules
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
