module.exports = {
  rules: {
    "jsdoc-match-params": require("./rules/jsdoc-match-params"),
    "align-one-var": require("./rules/align-one-var"),
    "no-trailing-spaces": require("./rules/no-trailing-spaces"),
    "new-line-after-block": require("./rules/new-line-after-block"),
    "constructor-variables": require("./rules/constructor-variables"),
    "methods-naming": require("./rules/methods-naming"),
    "regex-in-constructor": require("./rules/regex-in-constructor"),
    "no-async": require("./rules/no-async"),
    "no-const": require("./rules/no-const"),
    "two-lines-between-class-members": require("./rules/two-lines-between-class-members"),
    "align-requires": require("./rules/align-requires"),
    "multiline-comment-end-backslash": require("./rules/multiline-comment-end-backslash")
  }
};