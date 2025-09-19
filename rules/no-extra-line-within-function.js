export default {
  meta: {
    type: "layout",
    docs: {
      description: "enforce maximum one line break between declarations within functions",
      category: "Stylistic Issues",
      recommended: false,
    },
    fixable: "whitespace",
  },
  create(context) {
    const sourceCode = context.getSourceCode();

    function checkFunctionBody(node) {
      const bodyNode = node.body;
      if (bodyNode.type !== "BlockStatement") return;

      const lines = sourceCode.lines;

      for (let i = 1; i < bodyNode.body.length; i++) {
        const currentNode = bodyNode.body[i];
        const previousNode = bodyNode.body[i - 1];
        const lineOfCurrentNode = currentNode.loc.start.line;
        const lineOfPreviousNodeEnd = previousNode.loc.end.line;

        // Count the empty lines between the end of the previous node and the start of the current one
        let emptyLineCount = 0;
        for (let j = lineOfPreviousNodeEnd; j < lineOfCurrentNode - 1; j++) {
          if (lines[j].trim() === "") {
            emptyLineCount++;
          }
        }

        // Report an error if there are more than one empty line
        if (emptyLineCount > 1) {
          context.report({
            node: currentNode,
            message: "Expected at most one line break between declarations within a function.",
            fix(fixer) {
              const range = [
                sourceCode.getIndexFromLoc({ line: lineOfPreviousNodeEnd, column: 0 }),
                sourceCode.getIndexFromLoc({ line: lineOfCurrentNode, column: 0 })
              ];
              return fixer.replaceTextRange(range, "\n\n");
            }
          });
        }
      }
    }

    return {
      FunctionDeclaration: checkFunctionBody,
      FunctionExpression: checkFunctionBody,
      ArrowFunctionExpression(node) {
        if (node.body.type === "BlockStatement") {
          checkFunctionBody(node);
        }
      },
    };
  },
};