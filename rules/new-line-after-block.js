module.exports = {
  meta: {
    type: "layout",
    docs: {
      description: "enforce a newline after control flow statements",
      category: "Stylistic Issues",
      recommended: false,
    },
  },
  create(context) {
    return {
      IfStatement: checkForNewlineAfter,
      ForStatement: checkForNewlineAfter,
      WhileStatement: checkForNewlineAfter,
      SwitchStatement: checkForNewlineAfter,
      BreakStatement: checkForNewlineAfter,
      ContinueStatement: checkForNewlineAfter,
    };

    function checkForNewlineAfter(node) {
      const sourceCode = context.getSourceCode();
      const tokenAfter = sourceCode.getTokenAfter(node, {includeComments: true});

      if (!tokenAfter || tokenAfter.value === "}") {
        return;
      }

      const lineDifference = tokenAfter.loc.start.line - node.loc.end.line;

      if (lineDifference < 2) {
        context.report({
          node,
          message: "Expected a newline after control flow statement.",
        });
      } else if (lineDifference > 2) {
        context.report({
          node,
          message: "Expected exactly one newline after control flow statement, but found more.",
        });
      }
    }
  },
};
