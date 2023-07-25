module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "enforce computed properties alphabetical order",
      category: "Stylistic Issues",
      recommended: false
    },
    fixable: "code",
    schema: []  // no options
  },

  create(context) {
    return {
      'ExportDefaultDeclaration Property[key.name="computed"]'(node) {
        const properties = node.value.properties;

        properties.slice(0, -1).forEach((property, index) => {
          const nextProperty = properties[index + 1];
          if (property.key.name > nextProperty.key.name) {
            context.report({
              node: nextProperty,
              message: "Computed properties should be in alphabetical order.",
              fix(fixer) {
                const sourceCode = context.getSourceCode();
                const propertyText = sourceCode.getText(property);
                const nextPropertyText = sourceCode.getText(nextProperty);

                return [
                  fixer.replaceText(property, nextPropertyText),
                  fixer.replaceText(nextProperty, propertyText)
                ];
              }
            });
          }
        });
      }
    };
  }
};
