export default {
  meta: {
    type: "layout",
    docs: {
      description: "enforce at least one space before and exactly one space after = and : assignment",
      category: "Stylistic Issues",
      recommended: false,
    },
    fixable: "code",
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
    const sourceCode = context.sourceCode || context.getSourceCode();
    const config = context.options[0] || {};
    const checkColon = config.checkColon !== false;

    const checkSpacing = (operatorToken, valueNode, indentationNode) => {
      if (!operatorToken) {
        return;
      }

      const tokenBefore = sourceCode.getTokenBefore(operatorToken);
      const tokenAfter = sourceCode.getTokenAfter(operatorToken, {
        includeComments: true
      });
      const beforeText = sourceCode.text.slice(
        tokenBefore.range[1],
        operatorToken.range[0]
      );
      const afterText = sourceCode.text.slice(
        operatorToken.range[1],
        tokenAfter.range[0]
      );
      const hasSpaceBefore = /[ \t]$/.test(beforeText);
      const hasOneSpaceAfter = afterText === " ";
      const hasLineBreakAfter = (
        /^[\s]*$/.test(afterText) &&
        /[\r\n]/.test(afterText)
      );

      if (!hasSpaceBefore || !hasOneSpaceAfter) {
        context.report({
          node: operatorToken,
          message: `There should be at least one space before and exactly one space after '${operatorToken.value}'`,

          fix(fixer) {
            const fixes = [];

            if (!hasSpaceBefore && /^[ \t]*$/.test(beforeText)) {
              fixes.push(fixer.replaceTextRange(
                [tokenBefore.range[1], operatorToken.range[0]],
                " "
              ));
            }

            if (!hasOneSpaceAfter) {
              if (/^[ \t]*$/.test(afterText)) {
                fixes.push(fixer.replaceTextRange(
                  [operatorToken.range[1], tokenAfter.range[0]],
                  " "
                ));
              } else if (hasLineBreakAfter && valueNode) {
                const firstValueToken = sourceCode.getTokenAfter(operatorToken);

                if (firstValueToken.value === "(") {
                  fixes.push(fixer.replaceTextRange(
                    [operatorToken.range[1], tokenAfter.range[0]],
                    " "
                  ));
                } else {
                  const indentation = " ".repeat(
                    indentationNode.loc.start.column
                  );

                  fixes.push(
                    fixer.replaceTextRange(
                      [operatorToken.range[1], tokenAfter.range[0]],
                      ` (${afterText}`
                    ),
                    fixer.insertTextAfter(
                      valueNode,
                      `\n${indentation})`
                    )
                  );
                }
              }
            }

            return fixes.length ? fixes : null;
          }
        });
      }
    }

    return {
      AssignmentExpression(node) {
        const operatorToken = sourceCode.getFirstTokenBetween(
          node.left,
          node.right,
          token => token.value === node.operator
        );

        checkSpacing(operatorToken, node.right, node);
      },
      VariableDeclarator(node) {
        if (node.init) {
          const operatorToken = sourceCode.getFirstTokenBetween(
            node.id,
            node.init,
            token => token.value === "="
          );

          checkSpacing(operatorToken, node.init, node.parent);
        }
      },

      Property(node) {
        if (checkColon && !node.method && !node.shorthand) {
          const operatorToken = sourceCode.getFirstTokenBetween(
            node.key,
            node.value,
            token => token.value === ":"
          );

          checkSpacing(operatorToken);
        }
      },
    };
  },
};
