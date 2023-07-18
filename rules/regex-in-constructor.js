// file: eslint-plugin-crisp/lib/rules/regex-in-constructor.js
module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce regex definitions in the constructor",
      category: "Best Practices",
      recommended: false,
    },
    fixable: null,  // This rule is not auto-fixable
  },
  create(context) {
    return {
      'MethodDefinition[kind!="constructor"] > FunctionExpression > BlockStatement': function(node) {
        const regexes = context.getSourceCode().getTokens(node).filter(token => token.type === "RegularExpression");

        if (regexes.length > 0) {
          context.report({
            node,
            message: "Regular expressions should be defined in the constructor."
          });
        }
      }
    };
  },
};


