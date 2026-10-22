export default {
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
    const sourceCode = context.sourceCode;

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
              const typeLine = sourceCode.lines[typeProperty.loc.start.line - 1];
              const leadingText = typeLine.slice(0, typeProperty.loc.start.column);
              const indent = leadingText.trim() === "" ? leadingText : "";

              return fixer.replaceTextRange(
                [typeToken.range[1], defaultToken.range[0]],
                `,\n\n${indent}`
              );
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