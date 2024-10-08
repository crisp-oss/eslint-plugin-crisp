module.exports = {
  configs: {
    recommended: require("./recommended"),
    "recommended-vue": require("./recommended-vue")
  },
  rules: {
    "align-comments": require("./rules/align-comments"),
    "align-consecutive-class-assignements": require("./rules/align-consecutive-class-assignements"),
    "align-one-var": require("./rules/align-one-var"),
    "align-requires": require("./rules/align-requires"),
    "const": require("./rules/const"),
    "constructor-variables": require("./rules/constructor-variables"),
    "enforce-optional": require("./rules/enforce-optional"),
    "header-check": require("./rules/header-check"),
    "header-comments-check": require("./rules/header-comments-check"),
    "import-group-comment": require("./rules/import-group-comment"),
    "import-group-order": require("./rules/import-group-order"),
    "jsdoc-align-params": require("./rules/jsdoc-align-params"),
    "jsdoc-check-indentation": require("./rules/jsdoc-check-indentation"),
    "jsdoc-check-optional-params": require("./rules/jsdoc-check-optional-params"),
    "jsdoc-enforce-access": require("./rules/jsdoc-enforce-access"),
    "jsdoc-enforce-classdesc": require("./rules/jsdoc-enforce-classdesc"),
    "jsdoc-require-description-uppercase": require("./rules/jsdoc-require-description-uppercase"),
    "methods-naming": require("./rules/methods-naming"),
    "methods-ordering": require("./rules/methods-ordering"),
    "multiline-comment-end-backslash": require("./rules/multiline-comment-end-backslash"),
    "newline-after-switch-case": require("./rules/newline-after-switch-case"),
    "no-async": require("./rules/no-async"),
    "no-extra-line-within-function": require("./rules/no-extra-line-within-function"),
    "no-var-in-blocks": require("./rules/no-var-in-blocks"),
    "no-space-in-optional-arguments": require("./rules/no-space-in-optional-arguments"),
    "no-useless-template-literals": require("./rules/no-useless-template-literals"),
    "no-short-parameters": require("./rules/no-short-parameters"),
    "one-space-after-operator": require("./rules/one-space-after-operator"),
    "regex-in-constructor": require("./rules/regex-in-constructor"),
    "ternary-parenthesis": require("./rules/ternary-parenthesis"),
    "two-lines-between-class-members": require("./rules/two-lines-between-class-members"),
    "variable-names": require("./rules/variable-names"),
    "vue-attribute-comma": require("./rules/vue-attribute-comma"),
    "vue-attribute-linebreak": require("./rules/vue-attribute-linebreak"),
    "vue-computed-order": require("./rules/vue-computed-order"),
    "vue-emits-order": require("./rules/vue-emits-order"),
    "vue-header-check": require("./rules/vue-header-check"),
    "vue-html-indent": require("./rules/vue-html-indent"),
    "vue-html-quotes": require("./rules/vue-html-quotes"),
    "vue-no-regex-data": require("./rules/vue-no-regex-data"),
    "vue-props-declaration-line-break": require("./rules/vue-props-declaration-line-break"),
    "vue-props-declaration-multiline": require("./rules/vue-props-declaration-multiline"),
    "vue-props-declaration-order": require("./rules/vue-props-declaration-order"),
    "vue-ref-case": require("./rules/vue-ref-case")
  }
};
