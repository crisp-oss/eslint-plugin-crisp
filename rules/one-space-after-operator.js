module.exports = {
  meta: {
    type: "layout",
    docs: {
      description: "enforce at least one space before and exactly one space after = and : assignment",
      category: "Stylistic Issues",
      recommended: false,
    },
    fixable: "whitespace", // or "code" or "whitespace"
    schema: [
      {
        type: "object",
        properties: {
          checkColon: {
            type: "boolean"
          }
        },
        additionalProperties: false,
        default: {
          checkColon: true
        }
      }
    ]
  },
  create(context) {
    const sourceCode = context.getSourceCode();
    const config = context.options[0] || {};
    const checkColon = config.checkColon !== false;

    const checkSpacing = (node, operatorToken, operatorName) => {
      if (Math.abs(sourceCode.getTokenBefore(operatorToken).loc.end.column - operatorToken.loc.start.column) < 1 || sourceCode.getTokenAfter(operatorToken).loc.start.column - operatorToken.loc.end.column > 1) {
        context.report({
          node: operatorToken,
          message: `There should be at least one space before and exactly one space after '${operatorName}'`,

          fix(fixer) {
            return fixer.replaceTextRange(
              [sourceCode.getTokenBefore(operatorToken).range[1], sourceCode.getTokenAfter(operatorToken).range[0]],
              ` ${operatorName} `
            );
          }
        });
      }
    }

    return {
      AssignmentExpression(node) {
        const operatorToken = sourceCode.getTokenBefore(node.right);
        checkSpacing(node, operatorToken, '=');
      },
      VariableDeclarator(node) {
        if (node.init) {
          const operatorToken = sourceCode.getTokenBefore(node.init);
          checkSpacing(node, operatorToken, '=');
        }
      },

      Property(node) {
        if (checkColon) {
          const operatorToken = sourceCode.getTokenBefore(node.value);
          checkSpacing(node, operatorToken, ':');
        }
      },
    };
  },
};
