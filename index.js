module.exports = {
  configs: {
    recommended: require('./recommended'),
  },
  rules: {
    "align-one-var": require("./rules/align-one-var"),
    "no-trailing-spaces": require("./rules/no-trailing-spaces"),
    "new-line-after-block": require("./rules/new-line-after-block"),
    "constructor-variables": require("./rules/constructor-variables"),
    "methods-naming": require("./rules/methods-naming"),
    "regex-in-constructor": require("./rules/regex-in-constructor"),
    "one-space-after-operator": require("./rules/one-space-after-operator"),
    "no-async": require("./rules/no-async"),
    "const": require("./rules/const"),
    "two-lines-between-class-members": require("./rules/two-lines-between-class-members"),
    "align-requires": require("./rules/align-requires"),
    "ternary-parenthesis": require("./rules/ternary-parenthesis"),
    "variable-names": require("./rules/variable-names"),
    "multiline-comment-end-backslash": require("./rules/multiline-comment-end-backslash")
  }
};