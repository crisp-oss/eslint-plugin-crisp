export default {
  create: function(context) {
    return {
      FunctionDeclaration: function(node) {
        if (node.async) {
          context.report({
            node: node,
            message: "async/await is not allowed, use Promises instead.",
          });
        }
      },
      ArrowFunctionExpression: function(node) {
        if (node.async) {
          context.report({
            node: node,
            message: "async/await is not allowed, use Promises instead.",
          });
        }
      },
      FunctionExpression: function(node) {
        if (node.async) {
          context.report({
            node: node,
            message: "async/await is not allowed, use Promises instead.",
          });
        }
      },
      MethodDefinition: function(node) {
        if (node.value && node.value.async) {
          context.report({
            node: node,
            message: "async/await is not allowed, use Promises instead.",
          });
        }
      },
    };
  },
};
