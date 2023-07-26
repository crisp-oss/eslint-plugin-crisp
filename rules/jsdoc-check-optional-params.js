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

      const parsed = doctrine.parse(jsDocComment.value, {
        unwrap: true,
        sloppy: true,
        tags: ["param"]
      });
      let jsdocParams = parsed.tags;

      // Remove "parent" params (i.e. 'payload' for 'payload.context'), \
      //   otherwise we end up with discrepancies between `jsdocParams` and \
      //   and `node.params`
      jsdocParams = jsdocParams.filter((item, index, self) => {
        // Check if next item exists and its name begins with current item's name followed by a dot
        return !(
          self[index + 1] &&
          self[index + 1].name.startsWith(item.name + '.')
        );
      });

      node.params.forEach((param, i) => {
        // If there's a corresponding JSDoc parameter
        if (jsdocParams[i]) {
          checkNode(param, jsdocParams[i], jsdocParams);
        }
      });

      function checkNode(node, jsdocParam, jsdocParams) {
        if (node.type === "AssignmentPattern" && jsdocParam.type.type !== "OptionalType") {
          context.report({
            node,
            message: "Optional parameters in JSDoc should be surrounded by brackets"
          });
        } else if (jsdocParam.type.type === "OptionalType" && node.type !== "AssignmentPattern") {
          context.report({
            node,
            message: "Non-optional parameters in JSDoc should not be surrounded by brackets"
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
