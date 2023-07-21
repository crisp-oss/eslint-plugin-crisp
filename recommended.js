module.exports = {
  env: {
    es6: true,
    node: true
  },

  settings: {
    jsdoc: {
      tagNamePreference: {
        returns: "return"
      },

      preferredTypes: {
        Function: "function"
      }
    }
  },

  plugins: [
    "eslint-plugin-jsdoc",
  ],

  extends: [
    "plugin:jsdoc/recommended"
  ],

  rules: {
    // General JS rules
    "no-eval": "error",
    "no-console": "warn",
    "no-debugger": "warn",
    "no-unused-vars": "warn",
    "indent": "off",
    "linebreak-style": ["error", "unix"],
    "quotes": ["error", "double", { "avoidEscape": true, "allowTemplateLiterals": true }],
    "semi": ["error", "always"],
    "max-len": ["error", 80],
    "comma-dangle": ["error", "never"],
    "arrow-parens": ["error", "always"],
    "default-param-last": "error",
    "padding-line-between-statements": [
      "error",

      { blankLine: "always", prev: "let", next: "*" },
      { blankLine: "any", prev: "let", next: "let" },
      { blankLine: "always", prev: "const", next: "*" },
      { blankLine: "any", prev: "const", next: "const" },
      { blankLine: "always", prev: "block-like", next: "*" },
      { blankLine: "always", prev: "continue", next: "*" },
      { blankLine: "always", prev: "break", next: "*" }
    ],

    // Crisp JSDoc rules
    "crisp/jsdoc-enforce-classdesc": "error",
    "crisp/align-jsdocs-params": "error",

    // JSDoc rules
    "jsdoc/require-param-description": "off",
    "jsdoc/newline-after-description": "off",
    "jsdoc/require-jsdoc": [
      "error",

      {
        require: {
          "FunctionDeclaration": true,
          "MethodDefinition": true,
          "ClassDeclaration": true,
          "ArrowFunctionExpression": false,
          "FunctionExpression": false
        }
      }
    ],

    // Crisp rules
    "crisp/align-one-var": "error",
    "crisp/multiline-comment-end-backslash": "error",
    "crisp/const": "error",
    "crisp/header-check": "error",
    "crisp/header-comments-check": "error",
    "crisp/regex-in-constructor": "error",
    "crisp/align-requires": "error",
    "crisp/two-lines-between-class-members": "error",
    "crisp/no-async": "error",
    "crisp/no-var-in-blocks": "error",
    "crisp/no-space-in-optional-arguments": "error",
    "crisp/no-short-parameters": ["error", {
      "exceptions": ["_", "$"]
    }],
    "crisp/methods-naming": "error",
    "crisp/one-space-after-operator": "error",
    "crisp/no-trailing-spaces": "error",
    "crisp/ternary-parenthesis": "error",
    "crisp/align-consecutive-class-assignements": "error",
    "crisp/variable-names": "error",
    "crisp/constructor-variables": "error"
  }
}
