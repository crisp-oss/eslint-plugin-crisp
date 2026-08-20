const isTopLevelDeclaration = (node) => {
  let parent = node.parent;

  if (parent?.type === "ExportNamedDeclaration") {
    parent = parent.parent;
  }

  return parent?.type === "Program";
};

const isExportedDeclaration = (node) => {
  return node.parent?.type === "ExportNamedDeclaration";
};

const isCallOrConstruction = (node) => {
  return node?.type === "CallExpression" || node?.type === "NewExpression";
};

const isFunctionExpression = (node) => {
  return (
    node?.type === "ArrowFunctionExpression" ||
    node?.type === "FunctionExpression"
  );
};

export default {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforce top-level uppercase or double-underscore constant names.",
      category: "Stylistic Issues",
      recommended: false
    },
    fixable: "code",

    schema: [{
      type: "object",
      properties: {
        exceptions: {
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
    const exceptions = options.exceptions || [];
    const sourceCode = context.sourceCode || context.getSourceCode();

    const isTopLevelCallArgument = (identifier) => {
      let scope = sourceCode.getScope(identifier);
      let variable;

      while (scope && !variable) {
        variable = scope.set.get(identifier.name);
        scope = scope.upper;
      }

      return variable?.references.some((reference) => {
        const parent = reference.identifier.parent;

        return (
          isCallOrConstruction(parent) &&
          parent.arguments.includes(reference.identifier)
        );
      }) || false;
    };

    return {
      VariableDeclaration(node) {
        if (node.kind !== "const") {
          return;
        }

        const isTopLevel = isTopLevelDeclaration(node);
        const isExported = isExportedDeclaration(node);
        const hasOnlyDestructuring = node.declarations.every((declaration) => {
          return declaration.id.type !== "Identifier";
        });
        const canReplaceWithLet = node.declarations.every((declaration) => {
          if (declaration.id.type !== "Identifier") {
            return true;
          }

          const name = declaration.id.name;
          const isValidConst =
            exceptions.includes(name) ||
            (
              name.startsWith("__") &&
              name.toUpperCase() === name
            );

          return name.startsWith("_") && !isValidConst;
        });

        if (!isTopLevel && !isExported && canReplaceWithLet) {
          context.report({
            node,
            message: hasOnlyDestructuring
              ? "Local destructuring declarations should use \"let\"."
              : "Local variables prefixed with \"_\" should use \"let\".",
            fix(fixer) {
              return fixer.replaceText(sourceCode.getFirstToken(node), "let");
            }
          });

          return;
        }

        node.declarations.forEach((declaration) => {
          if (declaration.id.type !== "Identifier") {
            if (isTopLevel || isExported) {
              return;
            }

            context.report({
              node: declaration,
              message: "Local destructuring declarations should use \"let\"."
            });

            return;
          }

          const name = declaration.id.name;
          const isUppercase = name.toUpperCase() === name;
          const hasValidPlacement =
            isTopLevel || name.startsWith("__");
          const isTopLevelBuilder =
            isTopLevel && isCallOrConstruction(declaration.init);
          const isTopLevelBuilderArgument =
            isTopLevel && isTopLevelCallArgument(declaration.id);
          const isFunction = isFunctionExpression(declaration.init);

          if (
            isExported ||
            isTopLevelBuilder ||
            isTopLevelBuilderArgument ||
            isFunction ||
            exceptions.includes(name) ||
            (isUppercase && hasValidPlacement)
          ) {
            return;
          }

          context.report({
            node: declaration.id,
            message:
              "Consts should be uppercase and defined at the top level or be replaced with let _variable (Crisp convention)."
          });
        });
      }
    };
  }
};
