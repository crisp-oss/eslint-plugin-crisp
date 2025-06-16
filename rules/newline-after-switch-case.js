function getTokensWithNewlineBetween(sourceCode, startNode, endNode) {
  const endLine = endNode.loc.start.line;

  let next = startNode;
  let previous = startNode;

  do {
    previous = next;
    next = sourceCode.getTokenOrCommentAfter(next);

    if (next.loc.start.line > previous.loc.end.line + 1) {
      return [previous, next];
    }
  } while (next.loc.start.line < endLine);

  return null;
}

export default {
  meta: {
    fixable: "whitespace",
    schema: []  // no options
  },

  create: function newlineBetweenSwitchCase(context) {
    let currentCodePath = null;
    const sourceCode = context.getSourceCode();

    return {
      onCodePathStart(codePath) {
        currentCodePath = codePath;
      },

      onCodePathEnd() {
        currentCodePath = currentCodePath.upper;
      },

      "SwitchCase:exit": (node) => {
        let lastNode = node.parent.cases[node.parent.cases.length - 1]

        // Last case?
        if (lastNode === node) {
          // Ignore it
          return;
        }

        let isFallthrough = false;

        if (
          node.consequent.length === 0 ||
          currentCodePath.currentSegments?.some((segment) => {
            return segment.reachable;
          })
        ) {
          isFallthrough = true;
        }

        const nextToken = sourceCode.getTokenAfter(node);

        const tokensWithBlankLinesBetween = getTokensWithNewlineBetween(
          sourceCode,
          node,
          nextToken
        );
        const hasBlankLinesBetween = Boolean(tokensWithBlankLinesBetween);
        const isNewlineRequired = isFallthrough ? false : true;

        if (hasBlankLinesBetween && !isNewlineRequired) {
          context.report({
            node,
            message: "Extraneous newlines between switch cases.",

            fix(fixer) {
              const [previous, next] = tokensWithBlankLinesBetween;
              return fixer.replaceTextRange(
                [previous.range[1], next.range[0] - next.loc.start.column],
                "\n"
              );
            }
          });
        } else if (!hasBlankLinesBetween && isNewlineRequired) {
          context.report({
            node,
            message: "Newline required between switch cases.",

            fix(fixer) {
              return fixer.insertTextAfter(node, "\n");
            }
          });
        }
      },
    };
  },
};