module.exports = {
  meta: {
    type: "layout",
    docs: {
      description: "enforce only one space after = and : assignment",
      category: "Stylistic Issues",
      recommended: false,
    },
    fixable: "whitespace", // or "code" or "whitespace"
    schema: [], // no options
  },
  create(context) {
    return {
      AssignmentExpression(node) {
        const sourceCode = context.getSourceCode();
        const operator = sourceCode.getTokenBefore(node.right);

        if (sourceCode.getTokenAfter(operator).loc.start.column - operator.loc.end.column > 1) {
          context.report({
            node: operator,
            message: "There should be exactly one space after '=' operator",
            fix(fixer) {
              return fixer.replaceTextRange(
                [operator.range[1], sourceCode.getTokenAfter(operator).range[0]],
                " "
              );
            }
          });
        }
      },
      VariableDeclarator(node) {
        if (node.init) {
          const sourceCode = context.getSourceCode();
          const operator = sourceCode.getTokenBefore(node.init);

          if (sourceCode.getTokenAfter(operator).loc.start.column - operator.loc.end.column > 1) {
            context.report({
              node: operator,
              message: "There should be exactly one space after '=' operator",
              fix(fixer) {
                return fixer.replaceTextRange(
                  [operator.range[1], sourceCode.getTokenAfter(operator).range[0]],
                  " "
                );
              }
            });
          }
        }
      },
      Property(node) {
        const sourceCode = context.getSourceCode();
        const operator = sourceCode.getTokenBefore(node.value);

        if (sourceCode.getTokenAfter(operator).loc.start.column - operator.loc.end.column > 1) {
          context.report({
            node: operator,
            message: "There should be exactly one space after ':'' operator",
            fix(fixer) {
              return fixer.replaceTextRange(
                [operator.range[1], sourceCode.getTokenAfter(operator).range[0]],
                " "
              );
            }
          });
        }
      },
    };
  },
};
