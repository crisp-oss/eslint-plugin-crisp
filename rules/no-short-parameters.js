export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow short parameter names',
      category: 'Stylistic Issues',
    },
    schema: [
      {
        type: 'object',
        properties: {
          exceptions: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create: function (context) {
    const options = context.options[0] || {};
    const exceptions = options.exceptions || [];

    return {
      'FunctionDeclaration, FunctionExpression, ArrowFunctionExpression, MethodDefinition': function (node) {
        if (node.params) {
          node.params.forEach((param) => {
            if (param.type === 'Identifier' && !exceptions.includes(param.name) && param.name.length < 2) {
              context.report({
                node: param,
                message: `Parameter name '${param.name}' is too short.`,
              });
            }
          });
        }
      },
    };
  },
};
