export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "enforce comment as first line in Vue data() return object",
      category: "Stylistic Issues",
      recommended: false
    },
    fixable: null,
    schema: []
  },

  create(context) {
    const COMMENT_PATTERN = /^--> (STATE|DATA|ROUTE PARAMS|COMPONENTS) <--$/;
    const COMMENT_LIKE_PATTERN = /^--> .+ <--$/;

    return {
      'Property[key.name="data"] > FunctionExpression > BlockStatement > ReturnStatement > ObjectExpression'(node) {
        const properties = node.properties;

        if (!properties || properties.length === 0) {
          return;
        }

        const sourceCode = context.getSourceCode();
        const comments = sourceCode.getCommentsInside(node);

        if (comments.length === 0) {
          context.report({
            node,
            message:
              "data() return object must start with a comment: " +
              "'// --> STATE <--', '// --> DATA <--', " +
              "'// --> ROUTE PARAMS <--', or '// --> COMPONENTS <--'."
          });

          return;
        }

        const firstComment = comments[0];

        if (
          firstComment.type !== "Line" ||
          !COMMENT_PATTERN.test(firstComment.value.trim())
        ) {
          context.report({
            node: firstComment,
            message:
              "data() return object must start with a comment: " +
              "'// --> STATE <--', '// --> DATA <--', " +
              "'// --> ROUTE PARAMS <--', or '// --> COMPONENTS <--'."
          });
        }

        comments.forEach((comment) => {
          if (comment.type === "Line") {
            const trimmed = comment.value.trim();

            if (
              COMMENT_LIKE_PATTERN.test(trimmed) &&
              !COMMENT_PATTERN.test(trimmed)
            ) {
              context.report({
                node: comment,
                message:
                  "Invalid comment. Must be '// --> STATE <--', " +
                  "'// --> DATA <--', '// --> ROUTE PARAMS <--', " +
                  "or '// --> COMPONENTS <--'."
              });
            }
          }
        });
      }
    };
  }
};
