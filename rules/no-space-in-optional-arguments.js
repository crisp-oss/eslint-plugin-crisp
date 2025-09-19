export default {
  create: function(context) {
    return {
      "FunctionDeclaration, FunctionExpression, ArrowFunctionExpression, MethodDefinition": function(node) {
        (node.params || []).forEach(param => {
          if (param.type === "AssignmentPattern") {
            const sourceCode = context.getSourceCode();
            const operatorToken = sourceCode.getFirstTokenBetween(param.left, param.right, token => token.value === "=");

            if (sourceCode.getTokenBefore(operatorToken).end !== operatorToken.start || sourceCode.getTokenAfter(operatorToken).start !== operatorToken.end) {
              context.report({
                node,
                message: "There should be no space before or after = in optional parameters"
              });
            }
          }
        });
      }
    };
  }
};
