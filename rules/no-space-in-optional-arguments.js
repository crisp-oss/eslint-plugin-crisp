export default {
  create: function(context) {
    return {
      "FunctionDeclaration, FunctionExpression, ArrowFunctionExpression, MethodDefinition": function(node) {
        (node.params || []).forEach(param => {
          if (param.type === "AssignmentPattern") {
            const sourceCode = context.sourceCode;
            const operatorToken = sourceCode.getFirstTokenBetween(param.left, param.right, token => token.value === "=");

            if (
              sourceCode.getTokenBefore(operatorToken).range[1] !== operatorToken.range[0] ||
              sourceCode.getTokenAfter(operatorToken).range[0] !== operatorToken.range[1]
            ) {
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
