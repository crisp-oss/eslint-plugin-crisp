export default {
  meta: {
    type: "problem",
    docs: {
      description: "Ensure all class properties in the constructor start with '_', except for specified exceptions",
      category: "Stylistic Issues",
    },
    schema: [
      {
        type: "object",
        properties: {
          filenameExceptions: {
            type: "array",
            items: { type: "string" },
          },
          variableExceptions: {
            type: "array",
            items: { type: "string" },
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const filename = context.filename || context.getFilename();
    const filenameExceptions = options.filenameExceptions || [];
    const variableExceptions = options.variableExceptions || [];

    const isFilenameException = filenameExceptions.some((exception) => filename.endsWith(exception));

    return {
      "MethodDefinition[kind='constructor'] > FunctionExpression > BlockStatement > ExpressionStatement > AssignmentExpression": function(node) {
        if(node.left.type === "MemberExpression" && node.left.object.type === "ThisExpression") {
          let varName = null;

          if (!node.left.computed && node.left.property.type === "Identifier") {
            varName = node.left.property.name;
          } else if (
            node.left.computed &&
            node.left.property.type === "Literal" &&
            typeof node.left.property.value === "string"
          ) {
            varName = node.left.property.value;
          }

          if (!varName) {
            return;
          }

          if (!varName.startsWith("_") && !isFilenameException && !variableExceptions.includes(varName)) {
            context.report({
              node,
              message: "Class properties in the constructor should start with '_', except for specified exceptions",
            });
          }
        }
      },
    };
  },
};
