module.exports = {
    create: function(context) {
        return {
            VariableDeclaration(node) {
                if (node.kind === 'const') {
                    context.report({
                        node,
                        message: 'Unexpected const declaration',
                    });
                }
            },
        };
    },
};
