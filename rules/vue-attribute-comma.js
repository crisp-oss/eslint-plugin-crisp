import utils from "eslint-plugin-vue/lib/utils/index.js";

export default {
  meta: {
    type: "problem",
    docs: {
      description: "disallow commas after attribute values in Vue templates",
      category: "Possible Errors",
      recommended: false,
    },
    fixable: "code",
    schema: [], // no options
  },

  create(context) {
    return utils.defineTemplateBodyVisitor(context, {
      'VAttribute'(node) {
        const sourceCode = context.getSourceCode();
        const attributeText = sourceCode.getText(node);
        const attributeEndIndex = node.range[1];
        const nextChar = sourceCode.getText().slice(attributeEndIndex, attributeEndIndex + 1);

        if (nextChar === ',') {
          context.report({
            node,
            message: 'Comma after attribute value is not allowed.',
            fix(fixer) {
              return fixer.removeRange([attributeEndIndex, attributeEndIndex + 1]);
            },
          });
        }
      },
    });
  },
};
