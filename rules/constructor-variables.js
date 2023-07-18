module.exports = {
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
    const filename = context.getFilename();
    const filenameExceptions = options.filenameExceptions || [];
    const variableExceptions = options.variableExceptions || [];

    const isFilenameException = filenameExceptions.some((exception) => filename.endsWith(exception));

    return {
      "MethodDefinition[kind='constructor'] > FunctionExpression > BlockStatement > ExpressionStatement > AssignmentExpression": function(node) {
        if(node.left.type === "MemberExpression" && node.left.object.type === "ThisExpression"){
          const varName = node.left.property.name;
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
