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

    // Crisp JSDoc rules
    "crisp/jsdoc-enforce-classdesc": "error",

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
