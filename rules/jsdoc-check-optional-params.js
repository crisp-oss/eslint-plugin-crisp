const doctrine = require("doctrine");

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce @classdesc in JSDoc class headers",
      category: "Best Practices",
      recommended: true,
    }
  },

  create(context) {
    function checkOptionalParams(node) {
      // Get JSDoc comments
      const jsDocComment = context.getSourceCode().getJSDocComment(node);

      if (!jsDocComment) {
        return;
      }

      const parsed = doctrine.parse(jsDocComment.value, { unwrap: true });
      const jsdocParams = parsed.tags.filter((tag) => tag.title === "param");

      node.params.forEach((param, i) => {
        // If there's a corresponding JSDoc parameter
        if (jsdocParams[i]) {
          checkNode(param, jsdocParams[i], jsdocParams);
        }
      });

      function checkNode(node, jsdocParam, jsdocParams) {
        if (node.type === "AssignmentPattern" && !/^\[.*\]$/.test(jsdocParam.name)) {
          context.report({
            node,
            message: "Optional parameters in JSDoc should be surrounded by brackets"
          });
        } else if (node.type === "ObjectPattern") {
          node.properties.forEach((property) => {
            const nestedJsdocParam = jsdocParams.find((param) => {
              const nameSegments = param.name.split('.');
              return nameSegments[nameSegments.length - 1] === property.key.name;
            });
            if (nestedJsdocParam) {
              checkNode(property.value, nestedJsdocParam, jsdocParams);
            }
          });
        }
      }
    }

    return {
      FunctionDeclaration: checkOptionalParams,
      FunctionExpression: checkOptionalParams
    };
  }
};
