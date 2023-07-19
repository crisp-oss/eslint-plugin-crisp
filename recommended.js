module.exports = {
  "env": {
    "es6": true,
    "node": true
  },
  "settings": {
    "jsdoc": {
      "tagNamePreference": {
        "returns": "return"
      },

      "preferredTypes": {
        "Function": "function"
      }
    }
  },
  "plugins": [
    "eslint-plugin-jsdoc",
  ],
  "extends": [
    "plugin:jsdoc/recommended"
  ],
  "rules": {
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
    "jsdoc/require-param-description": "off",
    "jsdoc/newline-after-description": "off",
    "crisp/align-one-var": ["error"],
    "crisp/multiline-comment-end-backslash": "error",
    "crisp/const": "error",
    "crisp/regex-in-constructor": ["error"],
    "crisp/align-requires": "error",
    "crisp/two-lines-between-class-members": "error",
    "crisp/no-async": "error",
    "crisp/methods-naming": "error",
    "crisp/new-line-after-block": "error",
    "crisp/one-space-after-operator": "error",
    "crisp/no-trailing-spaces": "error",
    "crisp/ternary-parenthesis": "error",
    "crisp/variable-names": ["error", {
      "variableExceptions": ["fn"]
    }],

    "crisp/constructor-variables": ["error", {
      "filenameExceptions": ["app.js"],
      "variableExceptions": ["client"]
    }]
  }
}
