module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "enforce a blank line before break statements",
      category: "Stylistic Issues",
      recommended: false
    },
    schema: []  // no options
  },

  create(context) {
    return {
      "BreakStatement": function (node) {
        const sourceCode = context.getSourceCode();

        // Get the token before the "break" keyword. This could be either a \
        //   statement, or the opening brace of a case clause.
        const tokenBefore = sourceCode.getTokenBefore(node, { includeComments: true });

        // Get the token two places before the "break" keyword.
        const tokenTwoBefore = sourceCode.getTokenBefore(tokenBefore, { includeComments: true });

        // Retrieve the switch case statement related to the current break \
        //   statement.
        const caseToken = sourceCode.getNodeByRangeIndex(tokenBefore.range[0] - 2);

        // If the caseToken exists and has one or no statements (meaning it \
        //   only contains a break statement), we do not enforce a new line \
        //   before the "break" statement.
        if (caseToken && caseToken.test && caseToken.consequent.length <= 1){
          return;
        }

        // If there's not an empty line before the "break" statement (excluding comments), report an error.
        if (tokenTwoBefore && tokenTwoBefore.loc.end.line === node.loc.start.line - 1) {
          context.report({
            node,
            message: "Expected an empty line before \"break;\" statement."
          });
        }
      }
    };
  }
};
