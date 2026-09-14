import utils from "eslint-plugin-vue/dist/utils/index.js";

// Checks whether an attribute is a static class attribute
function isStaticClass(attribute, sourceCode) {
  if (attribute.directive === true || attribute.key.name !== "class") {
    return false;
  }

  // Ignore Pug class shorthands (eg. 'div.foo'), as they cannot be moved
  return sourceCode.getText(attribute).startsWith("class");
}

// Checks whether an attribute is a bound attribute (eg. ':prop' or 'v-bind:prop')
function isBoundAttribute(attribute) {
  return (
    attribute.directive === true &&
    attribute.key.name.name === "bind" &&
    attribute.key.argument !== null &&
    attribute.key.argument.type === "VIdentifier"
  );
}

// Checks whether an attribute is a bound class attribute
function isBoundClass(attribute) {
  return isBoundAttribute(attribute) && attribute.key.argument.name === "class";
}

// Checks whether an attribute holds a value (ie. not a boolean shorthand prop)
function hasValue(attribute) {
  return attribute.value !== null;
}

export default {
  meta: {
    type: "layout",
    docs: {
      description: "enforce class attributes to be declared last within their group",
      category: "Stylistic Issues",
      recommended: false,
    },
    fixable: null,
    schema: [], // no options
  },

  create(context) {
    const sourceCode = context.getSourceCode();

    // Reports attributes declared after the class attribute they should precede
    function reportAttributesAfter(attributes, classIndex, className, isMisplaced) {
      if (classIndex === -1) {
        return;
      }

      attributes.slice(classIndex + 1).forEach((attribute) => {
        if (isMisplaced(attribute)) {
          context.report({
            node: attribute,
            message: "Attribute \"{{attributeName}}\" must be declared before the \"{{className}}\" attribute.",
            data: {
              attributeName: sourceCode.getText(attribute.key),
              className,
            },
          });
        }
      });
    }

    return utils.default.defineTemplateBodyVisitor(context, {
      "VStartTag"(node) {
        const boundClassIndex = node.attributes.findIndex(isBoundClass);
        const staticClassIndex = node.attributes.findIndex((attribute) => {
          return isStaticClass(attribute, sourceCode);
        });

        // Bound class must come last among bound attributes
        reportAttributesAfter(
          node.attributes, boundClassIndex, ":class", isBoundAttribute
        );

        // Static class must come last among attributes holding a value
        reportAttributesAfter(
          node.attributes, staticClassIndex, "class", hasValue
        );
      },
    });
  },
};
