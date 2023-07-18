// file: eslint-plugin-crisp/lib/rules/multiline-comment-end-backslash.js
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

        comments.forEach(comment => {
          if (
            comment.type === 'Block' && 
            !comment.value.trim().endsWith('\\') && 
            !comment.value.trim().startsWith('*')
          ) {
            context.report({
              node: comment,
              message: "Multiline comments should end with a backslash '\\', unless they are JSDoc comments.",
            });
          }
        });
      },
    };
  },
};
