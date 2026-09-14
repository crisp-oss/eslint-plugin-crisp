import utils from "eslint-plugin-vue/dist/utils/index.js";

// Checks whether an attribute is a static class attribute
function isStaticClass(attribute) {
  return (
    attribute.directive === false &&
    attribute.key.name === "class"
  );
}

// Checks whether an attribute is a bound class directive
function isBoundClass(attribute) {
  return (
    attribute.directive === true &&
    attribute.key.name.name === "bind" &&
    attribute.key.argument !== null &&
    attribute.key.argument.type === "VIdentifier" &&
    attribute.key.argument.name === "class"
  );
}

export default {
  meta: {
    type: "problem",
    docs: {
      description: "disallow using both static and bound class attributes on the same element",
      category: "Possible Errors",
      recommended: false,
    },
    fixable: null,
    schema: [], // no options
  },

  create(context) {
    return utils.default.defineTemplateBodyVisitor(context, {
      "VStartTag"(node) {
        const staticClass = node.attributes.find(isStaticClass);
        const boundClass = node.attributes.find(isBoundClass);

        if (staticClass && boundClass) {
          context.report({
            node: boundClass,
            message: "Cannot use both \"class\" and \":class\" on the same element, merge them into \":class\".",
          });
        }
      },
    });
  },
};
