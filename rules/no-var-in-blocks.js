export default {
  create: function (context) {
    return {
      'FunctionDeclaration VariableDeclaration[kind="var"], FunctionExpression VariableDeclaration[kind="var"], ArrowFunctionExpression VariableDeclaration[kind="var"], MethodDefinition VariableDeclaration[kind="var"], ClassDeclaration VariableDeclaration[kind="var"]': function (node) {
        var isRequire = node.declarations.some(function (declaration) {
          if (declaration.init) {
            if (declaration.init.type === "CallExpression" && declaration.init.callee.name === "require") {
              return true;
            }
            if (declaration.init.type === "MemberExpression") {
              return declaration.init.object.type === "CallExpression" && declaration.init.object.callee.name === "require";
            }
          }
          return false;
        });
        if (!isRequire) {
          context.report({
            node: node,
            message: "Unexpected 'var' declaration inside function, method, or class block."
          });
        }
      }
    }
  }
}
