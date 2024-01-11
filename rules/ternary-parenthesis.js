module.exports = {
  meta: {
    type: "layout",
    docs: {
      description: "enforce parentheses around the condition in ternary expressions, if there is an operator in the condition",
      category: "Stylistic Issues",
      recommended: false,
    },
    schema: [], // no options
    fixable: "code",
  },
  create(context) {
    return {
      ConditionalExpression(node) {
        if (node.test.type === "BinaryExpression" || node.test.type === "LogicalExpression") {
          const sourceCode = context.getSourceCode();
          const beforeOperatorToken = sourceCode.getTokenBefore(node.test);
          const afterOperatorToken = sourceCode.getTokenAfter(node.test);

          if (beforeOperatorToken.value !== "(" || afterOperatorToken.value !== ")") {
            context.report({
              node,
              message: "The condition in ternary expressions with an operator should be wrapped in parentheses",

              fix(fixer) {
                const conditionText = sourceCode.getText(node.test);
                return [
                  fixer.insertTextBefore(node.test, "("),
                  fixer.insertTextAfter(node.test, ")"),
                ];
              },
            });
          }
        }
      },
    };
  },
};
