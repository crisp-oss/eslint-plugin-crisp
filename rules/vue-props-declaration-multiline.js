export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "enforce multi-line declaration for Vue props",
      category: "Stylistic Issues",
      recommended: false,
    },
    fixable: "code",
    schema: [], // no options
  },

  create(context) {
    return {
      'ExportDefaultDeclaration Property[key.name="props"] ObjectExpression'(node) {
        node.properties.forEach(prop => {
          // Ensuring we only target the top-level prop definitions
          if (prop.value.type === "ObjectExpression") {
            const propDefinition = prop.value;

            // Check if the prop definition is on a single line
            if (propDefinition.loc.start.line === propDefinition.loc.end.line) {
              context.report({
                node: prop,
                message: "Props should be declared in multiple lines.",

                fix(fixer) {
                  const sourceCode = context.getSourceCode();
                  const propText = sourceCode.getText(propDefinition);

                  // Construct the multi-line version of the prop
                  const expandedProp = propText
                    .replace("{", "{\n")
                    .replace("}", "\n}")
                    .replace(/, /g, ",\n");

                  return fixer.replaceText(propDefinition, expandedProp);
                }
              });
            }
          }
        });
      }
    };
  }
};
