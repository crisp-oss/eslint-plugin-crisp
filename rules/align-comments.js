module.exports = {
  meta: {
    type: "layout",
    docs: {
      description: "enforce comments alignment with the next line",
      category: "Stylistic Issues",
      recommended: false,
    },
    fixable: "whitespace",
    schema: [],
  },

  create(context) {
    const sourceCode = context.getSourceCode();
    const processedComments = new Set();

    function checkNode(node) {
      // Ignore nodes without location info
      if (!node.loc) {
        return
      };

      const comments = sourceCode.getCommentsBefore(node);

      comments.forEach(comment => {
        if (processedComments.has(comment)) {
          return
        };

        const commentLine = comment.loc.start.line;
        const commentEndLine = comment.loc.end.line;
        const nodeLine = node.loc.start.line;
        const commentIndent = comment.loc.start.column;
        const nodeIndent = node.loc.start.column;

        // Ignore comments on the same line as code
        for (let line = commentLine; line <= commentEndLine; line++) {
          const lineText = sourceCode.lines[line - 1].trim();

          // Ignore if the line contains code
          if (lineText && !lineText.startsWith("//")) {
            return
          };
        }

        if (commentIndent !== nodeIndent) {
          processedComments.add(comment);

          context.report({
            node,
            message: "Comment should be aligned with the next line.",

            fix(fixer) {
              const indent = " ".repeat(nodeIndent);
              const commentText = sourceCode.getText(comment);
              const fixedComment = `\n${indent}${commentText.trim()}`;
              return fixer.replaceTextRange([comment.range[0], comment.range[1]], fixedComment);
            },
          });
        }
      });
    }

    return {
      Program(node) {
        node.body.forEach(statement => {
          checkNode(statement);
        });
      },

      BlockStatement(node) {
        node.body.forEach(statement => {
          checkNode(statement);
        });
      },

      ArrowFunctionExpression(node) {
        if (node.body.type === "BlockStatement") {
          node.body.body.forEach(statement => {
            checkNode(statement);
          });
        } else {
          checkNode(node.body);
        }
      },

      FunctionExpression(node) {
        if (node.body.type === "BlockStatement") {
          node.body.body.forEach(statement => {
            checkNode(statement);
          });
        }
      },

      FunctionDeclaration(node) {
        if (node.body.type === "BlockStatement") {
          node.body.body.forEach(statement => {
            checkNode(statement);
          });
        }
      },
    };
  },
};
