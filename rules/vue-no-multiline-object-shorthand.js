export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "Require explicit property keys and values in multiline objects, except component registrations and default exports."
    },
    schema: [],
    messages: {
      explicitProperty: "Use explicit keys and values instead of shorthand properties in multiline objects."
    }
  },

  create(context) {
    return {
      ObjectExpression(node) {
        if (node.loc.start.line === node.loc.end.line) {
          return;
        }

        const parent = node.parent;

        if (parent.type === "ExportDefaultDeclaration") {
          return;
        }

        if (
          parent.type === "Property" &&
          parent.value === node &&
          !parent.computed &&
          (
            (parent.key.type === "Identifier" && parent.key.name === "components") ||
            (parent.key.type === "Literal" && parent.key.value === "components")
          )
        ) {
          return;
        }

        for (const property of node.properties) {
          if (property.type === "Property" && property.shorthand) {
            context.report({
              node: property,
              messageId: "explicitProperty"
            });
          }
        }
      }
    };
  }
};
