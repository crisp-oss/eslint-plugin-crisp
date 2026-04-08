export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "enforce at least one separator comment in Vue methods block",
      category: "Stylistic Issues",
      recommended: false
    },
    fixable: null,
    schema: []
  },

  create(context) {
    const SEPARATOR_PATTERN = /^--> (ACTIONS|HELPERS|EVENT LISTENERS) <--$/;

    return {
      'ExportDefaultDeclaration Property[key.name="methods"]'(node) {
        const properties = node.value.properties;

        if (!properties || properties.length === 0) {
          return;
        }

        const sourceCode = context.getSourceCode();
        const comments = sourceCode.getCommentsInside(node);

        const hasSeparator = comments.some((comment) => {
          return (
            comment.type === "Line" &&
            SEPARATOR_PATTERN.test(comment.value.trim())
          );
        });

        if (!hasSeparator) {
          context.report({
            node,
            message:
              "Methods block must contain at least one separator comment " +
              "('// --> ACTIONS <--', '// --> HELPERS <--', " +
              "or '// --> EVENT LISTENERS <--')"
          });
        }
      }
    };
  }
};
