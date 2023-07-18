module.exports = {
  "env": {
    "es6": true,
    "node": true
  },
  "plugins": [
    "eslint-plugin-jsdoc"
  ],
  "rules": {
    "indent": "off",
    "linebreak-style": ["error", "unix"],
    "quotes": ["error", "double", { "avoidEscape": true, "allowTemplateLiterals": true }],
    "semi": ["error", "always"],
    "max-len": ["error", 80],
    "comma-dangle": ["error", "never"],
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
    "crisp/variable-names": "error",
    "crisp/jsdoc-match-params": ["error", { "exceptions": ["constructor"] }],

    "crisp/constructor-variables": ["error", {
      "exceptions": ["client"]
    }],
    "jsdoc/require-jsdoc": ["error", {
      "require": {
        "FunctionDeclaration": true,
        "MethodDefinition": true,
        "ClassDeclaration": true,
        "ArrowFunctionExpression": false,
        "FunctionExpression": false
      }
    }]
  }
}
