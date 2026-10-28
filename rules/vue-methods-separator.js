const SEPARATORS = [
  "--> ACTIONS <--",
  "--> HELPERS <--",
  "--> EVENT LISTENERS <--"
];

const SEPARATOR_ORDER = new Map(
  SEPARATORS.map((separator, index) => [separator, index])
);
const SEPARATOR_LIKE_PATTERN = /^--> .+ <--$/;

export default {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "enforce separator comments and their order in Vue methods block",
      category: "Stylistic Issues",
      recommended: false
    },
    fixable: null,
    schema: [],
    messages: {
      duplicateSeparator:
        "Duplicate methods separator comment '// {{separator}}'.",
      invalidSeparator:
        "Invalid separator comment. Must be '// --> ACTIONS <--', " +
        "'// --> HELPERS <--', or '// --> EVENT LISTENERS <--'.",
      missingSeparator:
        "Methods block must contain at least one separator comment: " +
        "'// --> ACTIONS <--', '// --> HELPERS <--', " +
        "or '// --> EVENT LISTENERS <--'.",
      unorderedSeparator:
        "Methods separator comments must be ordered: '// --> ACTIONS <--', " +
        "then '// --> HELPERS <--', then '// --> EVENT LISTENERS <--'."
    }
  },

  create(context) {
    const sourceCode = context.sourceCode;

    function checkMethods(node) {
      const properties = node.value.properties;

      if (!properties || properties.length === 0) {
        return;
      }

      const comments = sourceCode.getCommentsInside(node.value).filter(
        (comment) => {
          return !properties.some((property) => {
            return (
              comment.range[0] >= property.range[0] &&
              comment.range[1] <= property.range[1]
            );
          });
        }
      );
      const seenSeparators = new Set();
      let lastSeparatorOrder = -1;
      let separatorCount = 0;

      comments.forEach((comment) => {
        if (comment.type !== "Line") {
          return;
        }

        const separator = comment.value.trim();
        const separatorOrder = SEPARATOR_ORDER.get(separator);

        if (separatorOrder === undefined) {
          if (SEPARATOR_LIKE_PATTERN.test(separator)) {
            context.report({
              node: comment,
              messageId: "invalidSeparator"
            });
          }

          return;
        }

        separatorCount++;

        if (seenSeparators.has(separator)) {
          context.report({
            node: comment,
            messageId: "duplicateSeparator",
            data: { separator }
          });

          return;
        }

        seenSeparators.add(separator);

        if (separatorOrder < lastSeparatorOrder) {
          context.report({
            node: comment,
            messageId: "unorderedSeparator"
          });
        } else {
          lastSeparatorOrder = separatorOrder;
        }
      });

      if (separatorCount === 0) {
        context.report({
          node,
          messageId: "missingSeparator"
        });
      }
    }

    return {
      'ExportDefaultDeclaration > ObjectExpression > Property[key.name="methods"]':
        checkMethods,
      'ExportDefaultDeclaration > CallExpression[callee.name="defineComponent"] > ObjectExpression > Property[key.name="methods"]':
        checkMethods
    };
  }
};
