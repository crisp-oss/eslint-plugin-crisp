export default {
  meta: {
    type: "problem",
    docs: {
      description: "disallow regex in Vue data object",
      category: "Possible Errors",
      recommended: true,
    },
    fixable: "code",
  },

  create(context) {
    function isRegex(node) {
      if (
        node &&
        node.type === "NewExpression" &&
        node.callee.name === "RegExp"
      ) {
        // Check for RegExp constructor
        return true;
      } else if (
        node &&
        node.type === "Literal" &&
        node.regex
      ) {
        // Check for RegExp literal
        return true;
      }

      return false;
    }

    return {
      'Property[key.name="data"] > FunctionExpression > BlockStatement > ReturnStatement > ObjectExpression'(node) {
        const properties = node.properties;

        properties.forEach((property, index) => {
          if (isRegex(property.value)) {
            context.report({
              node: property,
              message: "Do not use regex in Vue data object. Please move it outside, as a constant.",
            });
          }
        });
      }
    };
  }
};
