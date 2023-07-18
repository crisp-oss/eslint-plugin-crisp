module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "enforce that variables defined within a method start with '_', except for parameters",
      category: "Stylistic Issues",
      recommended: false,
    },
    schema: [{
      type: "object",
      properties: {
        variableExceptions: {
          type: "array",
          items: { type: "string" },
          uniqueItems: true,
        }
      },
      additionalProperties: false,
    }], // options schema updated
  },
  create(context) {
    const options = context.options[0] || {};
    const variableExceptions = options.variableExceptions || [];

    function checkDeclaration(node, body) {
      body.body.forEach((statement) => {
        if (statement.type === "VariableDeclaration") {
          statement.declarations.forEach((declaration) => {
            if (declaration.id.name && !declaration.id.name.startsWith("_") && !variableExceptions.includes(declaration.id.name)) {
              context.report({
                node: declaration,
                message: `Variables defined within a method should start with '_' ({${declaration.id.name}})`,
              });
            }
          });
        }
      });
    }

    return {
      MethodDefinition(node) {
        checkDeclaration(node, node.value.body);
      },
      ArrowFunctionExpression(node) {
        if (node.body.type === "BlockStatement") {
          checkDeclaration(node, node.body);
        }
      },
      FunctionExpression(node) {
        if (node.body.type === "BlockStatement") {
          checkDeclaration(node, node.body);
        }
      },
    };
  },
};
