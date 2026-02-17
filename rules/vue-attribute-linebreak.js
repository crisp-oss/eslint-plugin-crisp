import utils from "eslint-plugin-vue/dist/utils/index.js";

export default {
  meta: {
    type: "layout",
    docs: {
      description: "enforce the location of first and last attributes",
      category: "Stylistic Issues",
      recommended: false,
    },
    fixable: null
  },

  create(context) {
    function report(attribute, location) {
      context.report({
        node: attribute,
        message: `Expected a linebreak ${location} this attribute.`
      })
    }

    return utils.default.defineTemplateBodyVisitor(context, {
      VStartTag(node) {
        // Skip 'template' tags
        if (node.parent.name === "template") {
          return;
        }

        // No attributes
        if (node.attributes.length === 0) {
          return;
        }

        const firstAttribute = node.attributes[0];
        const lastAttribute = node.attributes[node.attributes.length - 1];

        // Enforce line-break before first attribute
        if (node.loc.start.line === firstAttribute.loc.start.line) {
          report(firstAttribute, "above");
        }

        // Enforce line-break after last attribute
        if (node.loc.end.line === lastAttribute.loc.start.line) {
          report(lastAttribute, "below");
        }
      }
    })
  }
};