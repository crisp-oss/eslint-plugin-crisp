import utils from "eslint-plugin-vue/dist/utils/index.js";

const CLASS_SHORTHAND_PATTERN = /\.[A-Za-z_][\w-]*/;

// Checks whether a Pug element name belongs to a Vue component
function isComponent(node) {
  return node.name.includes("-") || /^[A-Z]/.test(node.rawName);
}

// Checks whether an attribute is a class attribute
function isClassAttribute(attribute) {
  if (attribute.directive === false) {
    return attribute.key.name === "class";
  }

  return (
    attribute.key.name.name === "bind" &&
    attribute.key.argument !== null &&
    attribute.key.argument.type === "VIdentifier" &&
    attribute.key.argument.name === "class"
  );
}

export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "disallow mixing Pug class shorthand and class attributes",
      category: "Stylistic Issues",
      recommended: false,
    },
    fixable: null,
    schema: [], // no options
    messages: {
      useClassAttribute:
        "Move all Pug class shorthands to the class attribute.",
    },
  },

  create(context) {
    const sourceCode = context.sourceCode;

    return utils.default.defineTemplateBodyVisitor(context, {
      VElement(node) {
        if (isComponent(node)) {
          return;
        }

        const startTagText = sourceCode.getText(node.startTag);
        const elementHead = startTagText.split(/[\s(]/, 1)[0];
        const classAttribute = node.startTag.attributes.find(isClassAttribute);

        if (
          classAttribute &&
          CLASS_SHORTHAND_PATTERN.test(elementHead)
        ) {
          context.report({
            node: classAttribute,
            messageId: "useClassAttribute",
          });
        }
      },
    });
  },
};
