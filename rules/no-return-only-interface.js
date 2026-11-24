const TYPE_DECLARATION_TYPES = [
  "TSInterfaceDeclaration",
  "TSTypeAliasDeclaration"
];

const FUNCTION_TYPES = [
  "FunctionDeclaration",
  "FunctionExpression",
  "ArrowFunctionExpression"
];

export default {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Forbid interfaces and types only used as a function return type, " +
        "rely on type inference instead."
    },
    schema: [],
    messages: {
      noReturnOnlyInterface:
        "'{{ name }}' is only used as a function return type, remove it and " +
        "rely on type inference instead."
    }
  },

  create(context) {
    const sourceCode = context.sourceCode;

    // Check whether an identifier sits within a function return type
    function isInReturnType(identifier) {
      let node = identifier;

      while (node.parent) {
        if (FUNCTION_TYPES.includes(node.parent.type)) {
          return node.parent.returnType === node;
        }

        node = node.parent;
      }

      return false;
    }

    return {
      "Program:exit"() {
        for (const scope of sourceCode.scopeManager.scopes) {
          for (const variable of scope.variables) {
            const definition = variable.defs[0];

            if (!definition ||
                  !TYPE_DECLARATION_TYPES.includes(definition.node.type)) {
              continue;
            }

            // Exported types are part of the module public API
            if (definition.node.parent.type === "ExportNamedDeclaration") {
              continue;
            }

            const isReturnOnly = variable.references.length > 0 &&
              variable.references.every((reference) => {
                return isInReturnType(reference.identifier);
              });

            if (isReturnOnly) {
              context.report({
                node: definition.name,
                messageId: "noReturnOnlyInterface",

                data: {
                  name: variable.name
                }
              });
            }
          }
        }
      }
    };
  }
};
