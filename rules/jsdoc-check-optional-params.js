import doctrine from "doctrine";

export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce style for optional parameters",
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

      // This rule assumes that function params and JSDoc params match \
      //   (enforced by jsdoc/require-param)
      const parsed = doctrine.parse(jsDocComment.value, {
        unwrap: true,
        sloppy: true,
        tags: ["param"]
      });
      const jsdocParams = parsed.tags;

      let i = 0;

      if (jsdocParams.length) {
        node.params.forEach((param) => {
          i = checkNode(param, jsdocParams, i);
        });
      }

      function checkNode(node, jsdocParams, i) {
        let jsdocParam = jsdocParams[i];

        if (!jsdocParam || !jsdocParam.type) {
          context.report({
            node,
            message: "No matching JSDoc param found"
          });

          return;
        }

        if (node.type === "ObjectPattern") {
          i++;

          node.properties.forEach((property) => {
            i = checkNode(property.value, jsdocParams, i);
          });

          return i;
        } else if (node.type === "AssignmentPattern" && jsdocParam.type.type !== "OptionalType") {
          context.report({
            node,
            message: "Optional parameters in JSDoc should be surrounded by brackets"
          });
        } else if (jsdocParam.type.type === "OptionalType" && node.type !== "AssignmentPattern") {
          context.report({
            node,
            message: "Non-optional parameters in JSDoc should not be surrounded by brackets"
          });
        }

        return i + 1;
      }
    }

    return {
      FunctionDeclaration: checkOptionalParams,
      FunctionExpression: checkOptionalParams
    };
  }
};
