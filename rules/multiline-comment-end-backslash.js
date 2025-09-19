export default {
  meta: {
    type: "layout",
    docs: {
      description: "enforce that multiline comments should end with a backslash, except for JSDoc comments",
      category: "Stylistic Issues",
      recommended: false
    },
    fixable: null // Not auto-fixable
  },

  create(context) {
    return {
      Program() {
        const sourceCode = context.getSourceCode();
        const comments = sourceCode.getAllComments();

        let groupComments = [];

        const processGroupComments = (group) => {
          // Process each comment line in the group, except for the last one
          for (let i = 0; i < group.length - 1; i++) {
            const groupComment = group[i];
            // If a comment does not end with a backslash, report it
            if (!groupComment.value.trim().endsWith("\\")) {
              context.report({
                node: groupComment,
                message: "Multiline comments should end with a backslash '\\', unless they are JSDoc comments.",
              });
            }
          }
        };

        comments.forEach((comment, i) => {
          // Handle Block comments
          if (
            comment.type === "Block" &&
            comment.loc.start.line !== comment.loc.end.line &&
            !comment.value.trim().endsWith("\\") &&
            !comment.value.trim().startsWith("*")
          ) {
            context.report({
              node: comment,
              message: "Multiline comments should end with a backslash '\\', unless they are JSDoc comments.",
            });
          }

          // Handle Line comments
          if (comment.type === "Line") {
            // If a new comment group starts, process the last group first
            if (groupComments.length > 0 && !comment.value.startsWith("   ")) {
              processGroupComments(groupComments);

              // Clear the array for the next group of comments
              groupComments = [];
            }

            // Add the comment to the current group
            groupComments.push(comment);
          }
        });

        // After all comments have been processed, check if there is a last group left to process
        if (groupComments.length > 1) {
          // Process the last group in the same way as before
          processGroupComments(groupComments);
        }
      }
    }
  }
};
