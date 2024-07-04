module.exports = {
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
    return context.parserServices.defineTemplateBodyVisitor({
      "VAttribute[directive=false][key.name='ref']"(node) {
        const refValue = node.value && node.value.value;

        if (refValue && !/^[a-z]+(_[a-z]+)*$/.test(refValue)) {
          context.report({
            node,
            message: "Ref attribute \"{{refValue}}\" should be snake-cased.",
            data: {
              refValue,
            },
          });
        }
      }
    })
  }
};