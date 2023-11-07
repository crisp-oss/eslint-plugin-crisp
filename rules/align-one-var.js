module.exports = {
  meta: {
    type: "layout",
    docs: {
      description: "enforce alignment of variables in consecutive 'one-var' statements",
      category: "Stylistic Issues",
      recommended: false,
    },
  },
  create(context) {
    const sourceCode = context.getSourceCode();

    return {
      VariableDeclaration(node) {
        if (node.declarations.length <= 1) {
          return;
        }

        let assignmentOperatorColumn = null;
        let variableNameColumn = null;
        let lastDeclarationLine = null;

        for (let i = 0; i < node.declarations.length; i++) {
          const declaration = node.declarations[i];

          // If the current declaration is on the same line as the last one, \
          //   skip it
          if (lastDeclarationLine === declaration.loc.start.line) {
            continue;
          }

          lastDeclarationLine = declaration.loc.start.line;

          const variableNameToken = sourceCode.getFirstToken(declaration);
          const variableNameColumnCurrent = variableNameToken.loc.start.column;

          if (variableNameColumn === null) {
            variableNameColumn = variableNameColumnCurrent;
          } else if (variableNameColumnCurrent !== variableNameColumn) {
            context.report({
              node: declaration,
              message: "Misaligned variable declaration."
            });
          }

          if (!declaration.init) {
            continue; // Skip if there's no assignment
          }

          const equalsSignToken = sourceCode.getTokenBefore(declaration.init);

          if (equalsSignToken.value !== "=") {
            continue; // Skip if it's not an assignment
          }

          const equalsSignColumn = equalsSignToken.loc.start.column;

          if (assignmentOperatorColumn === null) {
            assignmentOperatorColumn = equalsSignColumn;
          } else if (equalsSignColumn !== assignmentOperatorColumn) {
            context.report({
              node: declaration,
              message: "Misaligned assignment operator."
            });
          }
        }
      },
    };
  },
};
