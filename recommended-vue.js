module.exports = {
  env: {
    es6: true,
    node: true
  },

  plugins: [
    "eslint-plugin-jsdoc"
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

    // JSDoc rules
    "jsdoc/require-param-description": "off",
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
    "crisp/jsdoc-enforce-classdesc": "error",
    "crisp/align-jsdocs-params": "error",


    // Crisp JS rules
    "crisp/header-check": "error",
    "crisp/header-comments-check": "error",
    "crisp/methods-naming": "error",
    "crisp/multiline-comment-end-backslash": "error",
    "crisp/new-line-after-block": "error",
    "crisp/no-async": "error",
    "crisp/no-trailing-spaces": "error",
    "crisp/no-var-in-blocks": "error",
    "crisp/no-useless-template-literals": "error",
    "crisp/one-space-after-operator": "error",
    "crisp/regex-in-constructor": "error",
    "crisp/variable-names": "error",
    "crisp/no-short-parameters": [
      "error",

      {
        exceptions: ["_", "$", "x", "y"]
      }
    ],

    // Crisp Vue rules
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
  }
}
