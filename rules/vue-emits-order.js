module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "enforce emits alphabetical order",
      category: "Stylistic Issues",
      recommended: false
    },
    fixable: "code",
    schema: []  // no options
  },

  create(context) {
    return {
      'ExportDefaultDeclaration Property[key.name="emits"]'(node) {
        const elements = node.value.elements;

        elements.slice(0, -1).forEach((element, index) => {
          const nextElement = elements[index + 1];
          if (element.value > nextElement.value) {
            context.report({
              node: nextElement,
              message: "Emits should be in alphabetical order.",
              fix(fixer) {
                const sourceCode = context.getSourceCode();
                const elementText = sourceCode.getText(element);
                const nextElementText = sourceCode.getText(nextElement);

                return [
                  fixer.replaceText(element, nextElementText),
                  fixer.replaceText(nextElement, elementText)
                ];
              }
            });
          }
        });
      }
    };
  }
};
