const isLocalDeclaration = (node) => {
  let parent = node.parent;

  while (parent) {
    if (
      parent.type === "ArrowFunctionExpression" ||
      parent.type === "FunctionDeclaration" ||
      parent.type === "FunctionExpression"
    ) {
      return true;
    }

    parent = parent.parent;
  }

  return false;
};

export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce that local variable names follow internal conventions.",
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

    return {
      VariableDeclaration(node) {
        // Constant names are validated by the const rule.
        if (node.kind === "const" || !isLocalDeclaration(node)) {
          return;
        }

        for (const declaration of node.declarations) {
          if (declaration.id.type !== "Identifier") {
            continue;
          }

          if (
            !declaration.id.name.startsWith("_") &&
            !variableExceptions.includes(declaration.id.name)
          ) {
            context.report({
              node: declaration.id,
              message: `Local variables should start with "_" ({${declaration.id.name}})`
            });
          }
        }
      }
    };
  }
};
