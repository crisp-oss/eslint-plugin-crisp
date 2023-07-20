module.exports = {
  configs: {
    recommended: require("./recommended"),
    "recommended-vue": require("./recommended-vue")
  },
  rules: {
    "align-one-var": require("./rules/align-one-var"),
    "align-requires": require("./rules/align-requires"),
    "const": require("./rules/const"),
    "constructor-variables": require("./rules/constructor-variables"),
    "header-check": require("./rules/header-check"),
    "jsdoc-enforce-classdesc": require("./rules/jsdoc-enforce-classdesc"),
    "methods-naming": require("./rules/methods-naming"),
    "multiline-comment-end-backslash": require("./rules/multiline-comment-end-backslash"),
    "new-line-after-block": require("./rules/new-line-after-block"),
    "no-async": require("./rules/no-async"),
    "no-trailing-spaces": require("./rules/no-trailing-spaces"),
    "no-var-in-blocks": require("./rules/no-var-in-blocks"),
    "one-space-after-operator": require("./rules/one-space-after-operator"),
    "regex-in-constructor": require("./rules/regex-in-constructor"),
    "ternary-parenthesis": require("./rules/ternary-parenthesis"),
    "multiline-comment-end-backslash": require("./rules/multiline-comment-end-backslash"),
    "align-jsdocs-params": require("./rules/align-jsdocs-params"),
    "two-lines-between-class-members": require("./rules/two-lines-between-class-members"),
    "variable-names": require("./rules/variable-names")
  }
};
