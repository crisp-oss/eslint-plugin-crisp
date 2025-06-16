export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce @classdesc in JSDoc class headers",
      category: "Best Practices",
      recommended: true,
    }
  },

  create(context) {
    return {
      ClassDeclaration(node) {
        const jsdoc = context.getSourceCode().getJSDocComment(node);

        if (jsdoc) {
          const hasClassdesc = /@classdesc/.test(jsdoc.value);
          if (!hasClassdesc) {
            context.report({
              node,
              message: "JSDoc class header should include @classdesc"
            });
          } else {
            const hasNonEmptyDescription = /@classdesc\s+[^*\s]/.test(jsdoc.value);
            if (!hasNonEmptyDescription) {
              context.report({
                node,
                message: "The @classdesc tag in JSDoc class header should have a non-empty description",
              });
            }
          }
        }
      }
    };
  }
};
