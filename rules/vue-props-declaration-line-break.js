module.exports = {
  meta: {
    type: "layout",
    docs: {
      description: "Enforce line break between type and default function in Vue props",
      category: "Stylistic Issues",
      recommended: false,
    },
    fixable: "whitespace",
    schema: [], // no options
  },

  create(context) {
    const sourceCode = context.getSourceCode();

    function checkPropDefinition(propNode) {
      const typeProperty = propNode.properties.find(p => p.key.name === "type");
      const defaultProperty = propNode.properties.find(p => p.key.name === "default");

      if (typeProperty && defaultProperty && defaultProperty.value.type === "FunctionExpression") {
        const typeLine = sourceCode.getLastToken(typeProperty).loc.end.line;
        const defaultLine = sourceCode.getFirstToken(defaultProperty).loc.start.line;

        if (defaultLine - typeLine < 2) {
          context.report({
            node: defaultProperty,
            message: "There should be a line break between 'type' and 'default' function in prop definition.",
            fix(fixer) {
              const typeToken = sourceCode.getLastToken(typeProperty);
              const defaultToken = sourceCode.getFirstToken(defaultProperty);
              const textBetween = sourceCode.text.slice(typeToken.range[1], defaultToken.range[0]);
              const newTextBetween = textBetween.replace(/,?\s*/, ",\n\n");
              return fixer.replaceTextRange([typeToken.range[1], defaultToken.range[0]], newTextBetween);
            }
          });
        }
      }
    }

    return {
      'ExportDefaultDeclaration Property[key.name="props"] ObjectExpression'(node) {
        node.properties.forEach(prop => {
          if (prop.value.type === "ObjectExpression") {
            checkPropDefinition(prop.value);
          }
        });
      }
    };
  }
};