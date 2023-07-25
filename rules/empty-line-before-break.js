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
        // Get source code of the file.
        const sourceCode = context.getSourceCode();

        // Get the token before the "break" keyword. This could be either a \
        //   statement, or the opening brace of an "if" or "case" clause.
        const tokenBefore = sourceCode.getTokenBefore(node, { includeComments: true });

        // Get the token two places before the "break" keyword.
        const tokenTwoBefore = sourceCode.getTokenBefore(tokenBefore, { includeComments: true });

        // Retrieve the parent BlockStatement related to the current break \
        //   statement.
        const parentBlockStatement = node.parent;

        // Retrieve the parent Statement of the BlockStatement
        const parentStatement = parentBlockStatement.parent;

        // If the parentStatement is an IfStatement or SwitchCase and the \
        //   parentBlockStatement contains only the "break" statement, we \
        //   do not need to enforce a new line before the "break" statement.
        if(parentBlockStatement.body.length === 1 &&
           ((parentStatement.type === "IfStatement") ||
            (parentStatement.type === "SwitchCase"))){
          return;
        }

        // If there's not an empty line before the "break" statement \
        //   (excluding comments), report an error.
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
