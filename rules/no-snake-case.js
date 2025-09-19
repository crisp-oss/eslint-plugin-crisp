export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "disallow snake_case in declared arguments, variables, and methods (allows _ or __ prefixes)",
      category: "Stylistic Issues",
      recommended: false
    },
    schema: [] // no options
  },

  create(context) {
    /**
     * Check if a name is snake_case (after removing allowed prefixes)
     * @param {string} name - The identifier name to check
     * @param {boolean} isConstant - Whether this is a constant declaration
     * @returns {boolean} - True if the name is snake_case
     */
    function isSnakeCase(name, isConstant = false) {
      // Remove allowed prefixes (_ or __)
      let cleanName = name;
      if (name.startsWith("__")) {
        cleanName = name.slice(2);
      } else if (name.startsWith("_")) {
        cleanName = name.slice(1);
      }

      // Allow UPPER_SNAKE_CASE for constants
      if (isConstant && cleanName === cleanName.toUpperCase() && /^[A-Z][A-Z0-9_]*$/.test(cleanName)) {
        return false;
      }

      // Check if the remaining name contains underscores (indicating snake_case)
      return cleanName.includes("_");
    }

    /**
     * Report snake_case violation
     * @param {Object} node - The AST node
     * @param {string} name - The identifier name
     * @param {string} type - The type of identifier (variable, parameter, method, etc.)
     */
    function reportSnakeCase(node, name, type) {
      context.report({
        node: node,
        message: `${type} '${name}' should not use snake_case. Use camelCase instead.`
      });
    }

    return {
      // Check variable declarations
      VariableDeclaration(node) {
        node.declarations.forEach((declaration) => {
          if (declaration.id && declaration.id.name) {
            const name = declaration.id.name;
            const isConstant = node.kind === "const";
            if (isSnakeCase(name, isConstant)) {
              reportSnakeCase(declaration, name, "Variable");
            }
          }
        });
      },

      // Check function declarations
      FunctionDeclaration(node) {
        if (node.id && node.id.name) {
          const name = node.id.name;
          if (isSnakeCase(name)) {
            reportSnakeCase(node, name, "Function");
          }
        }

        // Check function parameters
        node.params.forEach((param) => {
          if (param.type === "Identifier" && param.name) {
            const name = param.name;
            if (isSnakeCase(name)) {
              reportSnakeCase(param, name, "Parameter");
            }
          }
        });
      },

      // Check method definitions (class methods)
      MethodDefinition(node) {
        if (node.key && node.key.name) {
          const name = node.key.name;
          if (isSnakeCase(name)) {
            reportSnakeCase(node, name, "Method");
          }
        }

        // Check method parameters
        if (node.value && node.value.params) {
          node.value.params.forEach((param) => {
            if (param.type === "Identifier" && param.name) {
              const name = param.name;
              if (isSnakeCase(name)) {
                reportSnakeCase(param, name, "Parameter");
              }
            }
          });
        }
      },

      // Check function expressions
      FunctionExpression(node) {
        // Check function parameters
        node.params.forEach((param) => {
          if (param.type === "Identifier" && param.name) {
            const name = param.name;
            if (isSnakeCase(name)) {
              reportSnakeCase(param, name, "Parameter");
            }
          }
        });
      },

      // Check arrow function expressions
      ArrowFunctionExpression(node) {
        // Check function parameters
        node.params.forEach((param) => {
          if (param.type === "Identifier" && param.name) {
            const name = param.name;
            if (isSnakeCase(name)) {
              reportSnakeCase(param, name, "Parameter");
            }
          }
        });
      },

      // Check object method properties
      Property(node) {
        // Check if it's a method property
        if (node.method || (node.value && (node.value.type === "FunctionExpression" || node.value.type === "ArrowFunctionExpression"))) {
          if (node.key && node.key.name) {
            const name = node.key.name;
            if (isSnakeCase(name)) {
              reportSnakeCase(node, name, "Method");
            }
          }

          // Check method parameters
          if (node.value && node.value.params) {
            node.value.params.forEach((param) => {
              if (param.type === "Identifier" && param.name) {
                const name = param.name;
                if (isSnakeCase(name)) {
                  reportSnakeCase(param, name, "Parameter");
                }
              }
            });
          }
        }
      }
    };
  }
};
