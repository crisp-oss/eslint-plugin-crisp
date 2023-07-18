module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "enforce that variables defined within a method start with '_', except for parameters",
      category: "Stylistic Issues",
      recommended: false,
    },
    schema: [], // no options
  },
  create(context) {
    function checkDeclaration(node, body) {
      body.body.forEach((statement) => {
        if (statement.type === "VariableDeclaration") {
          statement.declarations.forEach((declaration) => {
            if (declaration.id.name && !declaration.id.name.startsWith("_")) {
              context.report({
                node: declaration,
                message: "Variables defined within a method should start with '_'",
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
