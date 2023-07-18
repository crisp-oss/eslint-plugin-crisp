module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce that consts are uppercase and start with "__"',
      category: 'Stylistic Issues',
      recommended: false,
    },
    schema: [], // no options
  },
  create(context) {
    return {
      VariableDeclaration(node) {
        if (node.kind === 'const') {
          node.declarations.forEach((declaration) => {
            if (declaration.id && declaration.id.name && (!declaration.id.name.startsWith('__') || declaration.id.name.toUpperCase() !== declaration.id.name)) {
              context.report({
                node: declaration,
                message: 'Consts should be uppercase and start with "__"',
              });
            }
          });
        }
      },
    };
  },
};
