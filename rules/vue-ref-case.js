import utils from "eslint-plugin-vue/dist/utils/index.js";

// Pre-compiled regex for snake_case ref validation
const SNAKE_CASE_REF_PATTERN = /^[a-z]+(_[a-z]+)*$/;

export default {
  meta: {
    type: "layout",
    docs: {
      description: "enforce ref attributes to be snake-cased",
      category: "Stylistic Issues",
      recommended: false,
    },
    fixable: null
  },

  create(context) {
    return utils.default.defineTemplateBodyVisitor(context, {
      "VAttribute[directive=false][key.name='ref']"(node) {
        // Check if the ref attribute is not bound to an expression
        if (node.value && node.value.type === "VLiteral") {
          const refValue = node.value.value;

          if (refValue && !SNAKE_CASE_REF_PATTERN.test(refValue)) {
            context.report({
              node,
              message: "Ref attribute \"{{refValue}}\" should be snake-cased.",
              data: {
                refValue,
              },
            });
          }
        }
      }
    });
  }
};
