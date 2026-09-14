import utils from "eslint-plugin-vue/dist/utils/index.js";

const CLASS_SHORTHAND_PATTERN = /\.[A-Za-z_][\w-]*/;

// Checks whether a Pug element name belongs to a Vue component
function isComponent(node) {
  return node.name.includes("-") || /^[A-Z]/.test(node.rawName);
}

export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "disallow Pug class shorthand on Vue components",
      category: "Stylistic Issues",
      recommended: false,
    },
    fixable: null,
    schema: [], // no options
    messages: {
      useClassAttribute:
        "Use a class attribute instead of Pug class shorthand on component \"{{name}}\".",
    },
  },

  create(context) {
    const sourceCode = context.getSourceCode();

    return utils.default.defineTemplateBodyVisitor(context, {
      VElement(node) {
        if (!isComponent(node)) {
          return;
        }

        const startTagText = sourceCode.getText(node.startTag);
        const elementHead = startTagText.split(/[\s(]/, 1)[0];

        if (CLASS_SHORTHAND_PATTERN.test(elementHead)) {
          context.report({
            node: node.startTag,
            messageId: "useClassAttribute",
            data: {
              name: node.rawName,
            },
          });
        }
      },
    });
  },
};
