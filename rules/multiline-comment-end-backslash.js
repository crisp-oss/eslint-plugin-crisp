module.exports = {
  meta: {
    type: "layout",
    docs: {
      description: "enforce that multiline comments should end with a backslash, except for JSDoc comments",
      category: "Stylistic Issues",
      recommended: false,
    },
    fixable: null, // Not auto-fixable
  },
  create(context) {
    return {
      Program() {
        const sourceCode = context.getSourceCode();
        const comments = sourceCode.getAllComments();

        let lineCommentGroup = [];

        comments.forEach((comment, i) => {
          // Handle Block comments
          if (
            comment.type === "Block" &&
            comment.loc.start.line !== comment.loc.end.line &&
            !comment.value.trim().endsWith('\\') &&
            !comment.value.trim().startsWith("*")
          ) {
            context.report({
              node: comment,
              message: "Multiline comments should end with a backslash '\\', unless they are JSDoc comments.",
            });
          }

          // Handle Line comments
          if (comment.type === "Line") {
            lineCommentGroup.push(comment);
            const nextComment = comments[i + 1];

            if (nextComment && nextComment.loc.start.line - 1 === comment.loc.end.line) {
              // If the current comment is not the last in the group and does not end with a backslash,
              // report an error
              if (!comment.value.trim().endsWith('\\')) {
                context.report({
                  node: comment,
                  message: "This line of a multiline comment should end with a backslash '\\'.",
                });
              }

              // This is not the last comment in the group, continue to next iteration
              return;
            }
          }

          // Reset line comment group
          lineCommentGroup = [];
        });
      }
    }
  }
};
