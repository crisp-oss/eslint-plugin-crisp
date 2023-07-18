// file: eslint-plugin-crisp/lib/rules/align-requires.js
module.exports = {
  meta: {
    type: "layout",
    docs: {
      description: "enforce alignment of require statements",
      category: "Stylistic Issues",
      recommended: false,
    },
    fixable: null,  // not auto-fixable
  },
  create(context) {
    return {
      VariableDeclaration(node) {
        const declarations = node.declarations;

        // We only check consecutive VariableDeclarator nodes with 'require' init
        let lastColumn = null;

        for (const declaration of declarations) {
          if (declaration.init && declaration.init.callee && declaration.init.callee.name === 'require') {
            if (lastColumn === null) {
              lastColumn = declaration.loc.start.column;
            } else if (declaration.loc.start.column !== lastColumn) {
              context.report({
                node: declaration,
                message: "Misaligned require statement.",
              });
            }
          } else {
            lastColumn = null;  // reset for non-require declarations
          }
        }
      },
    };
  },
};
