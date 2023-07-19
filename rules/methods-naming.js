// File: eslint-plugin-custom/private-public-methods.js

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Check if a method with JSDoc is properly private, protected or public",
      category: "Possible Errors",
      recommended: true
    },
    schema: [] // This rule does not take any options.
  },

  create: function(context) {
    return {
      MethodDefinition: function(node) {
        const commentsBefore = context.getCommentsBefore(node);

        const jsDocComment = commentsBefore.find(comment =>
          comment.type === "Block" && comment.value.startsWith("*")
        );

        if (jsDocComment) {
          const isPrivate = node.key.name.startsWith("__");
          const isProtected = node.key.name.startsWith("_") && !node.key.name.startsWith("__");
          const isPublic = jsDocComment.value.includes("@public");
          const isProtectedJsDoc = jsDocComment.value.includes("@protected");
          const isPrivateJsDoc = jsDocComment.value.includes("@private");

          if (isPrivate && isPublic) {
            context.report({
              node: node,
              message: "Methods starting with '__' should not be marked with '@public'."
            });
          } else if (isProtected && isPublic) {
            context.report({
              node: node,
              message: "Methods starting with '_' should not be marked with '@public'."
            });
          } else if (!isPrivate && isPrivateJsDoc) {
            context.report({
              node: node,
              message: "Methods not starting with '__' should not be marked with '@private'."
            });
          } else if (!isProtected && isProtectedJsDoc) {
            context.report({
              node: node,
              message: "Methods not starting with '_' should not be marked with '@protected'."
            });
          }
        }
      }
    };
  }
};
