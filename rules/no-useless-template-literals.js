export default {
  create: function(context) {
    return {
      TemplateLiteral(node) {
        if (node.expressions.length === 0 && node.parent.type !== "BinaryExpression") {
          context.report({
            node,
            message: "Unnecessary use of template literals. Use regular strings instead."
          });
        }
      }
    };
  }
};
