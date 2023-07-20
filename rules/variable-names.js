module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "enforce that variables defined within a method start with '_', except for parameters",
      category: "Stylistic Issues",
      recommended: false
    },

    schema: [{
      type: "object",
      properties: {
        variableExceptions: {
          type: "array",
          items: { type: "string" },
          uniqueItems: true
        }
      },
      additionalProperties: false
    }]
  },

  create(context) {
    const options = context.options[0] || {};
    const variableExceptions = options.variableExceptions || [];

    function checkDeclaration(node) {
      if (!node) {
        return;
      }

      switch(node.type) {
        // In case of a variable declaration, it checks if the variable name \
        //   starts with "_" or is an exception
        case "VariableDeclaration": {
          node.declarations.forEach((declaration) => {
            if (declaration.id.name && !declaration.id.name.startsWith("_") && !variableExceptions.includes(declaration.id.name)) {
              context.report({
                node: declaration,
                message: `Variables defined within a method should start with "_" ({${declaration.id.name}})`,
              });
            }
          });

          break;
        }

        // BlockStatement and Program nodes contain lists of statements \
        //   (node.body), so we check each statement
        case "BlockStatement":
        case "Program": {
          node.body.forEach(checkDeclaration);

          break;
        }

        // IfStatement nodes have a consequent (then), and an \
        //   optional alternate (else) to be checked
        case "IfStatement": {
          checkDeclaration(node.consequent);

          if (node.alternate) {
            checkDeclaration(node.alternate);
          }

          break;
        }

        // Loops nodes contain a body with statements to be checked
        case "ForStatement":
        case "WhileStatement":
        case "DoWhileStatement":
        case "ForInStatement":
        case "ForOfStatement": {
          if (node.body) {
            checkDeclaration(node.body);
          }

          // Check the loop condition itself
          checkDeclaration(node.left);

          break;
        }

        // SwitchStatement nodes contain an array of SwitchCase nodes that \
        //   represent each case in the switch statement
        case "SwitchStatement": {
          node.cases.forEach(checkDeclaration);

          break;
        }

        // SwitchCase nodes contain a consequent which is an array of \
        //   Statements to be checked
        case "SwitchCase": {
          node.consequent.forEach(checkDeclaration);

          break;
        }

        default: {
          break;
        }
      }
    }

    return {
      // For each property in an object, if it's a function / arrow function, \
      //   check its body (usefull for Vue.js components, in which methods and \
      //   computed are defined as properties of a parent object)
      Property(node) {
        if (node.value.type === "FunctionExpression" ||
            node.value.type === "ArrowFunctionExpression") {
          checkDeclaration(node);
        }
      },

      MethodDefinition(node) {
        checkDeclaration(node.value.body);
      },

      ArrowFunctionExpression(node) {
        if (node.body.type === "BlockStatement") {
          checkDeclaration(node.body);
        }
      },

      FunctionExpression(node) {
        if (node.body.type === "BlockStatement") {
          checkDeclaration(node.body);
        }
      }
    };
  }
};
