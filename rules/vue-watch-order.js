const PROPERTY_ORDER = ["immediate", "deep", "handler"];

function getPropertyName(property) {
  if (property.type !== "Property" || property.computed) {
    return null;
  }

  return property.key.type === "Identifier"
    ? property.key.name
    : property.key.value;
}

function isVueOptionsObject(node) {
  const parent = node.parent;

  if (parent.type === "ExportDefaultDeclaration") {
    return true;
  }

  if (parent.type !== "CallExpression") {
    return false;
  }

  const callee = parent.callee;

  return (
    (callee.type === "Identifier" && callee.name === "defineComponent") ||
    (
      callee.type === "MemberExpression" &&
      !callee.computed &&
      callee.property.name === "defineComponent"
    )
  );
}

export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "enforce Vue watcher option order: immediate, deep, handler",
      category: "Stylistic Issues",
      recommended: false
    },
    fixable: "code",
    schema: [],
    messages: {
      order: "Watcher options must be ordered: `immediate`, `deep`, then `handler`."
    }
  },

  create(context) {
    const sourceCode = context.sourceCode;

    return {
      "Property > ObjectExpression"(node) {
        if (
          getPropertyName(node.parent) !== "watch" ||
          !isVueOptionsObject(node.parent.parent)
        ) {
          return;
        }

        node.properties.forEach((watcher) => {
          if (
            watcher.type !== "Property" ||
            watcher.value.type !== "ObjectExpression"
          ) {
            return;
          }

          const options = watcher.value;
          const properties = options.properties.filter((property) => {
            return PROPERTY_ORDER.includes(getPropertyName(property));
          });
          const sorted = [...properties].sort((first, second) => {
            return PROPERTY_ORDER.indexOf(getPropertyName(first)) -
              PROPERTY_ORDER.indexOf(getPropertyName(second));
          });

          if (properties.every((property, index) => property === sorted[index])) {
            return;
          }

          context.report({
            node: options,
            messageId: "order",

            fix(fixer) {
              // Avoid changing overrides, evaluation order or comment ownership.
              if (
                properties.length !== options.properties.length ||
                new Set(properties.map(getPropertyName)).size !== properties.length ||
                properties.some((property) => {
                  return property.kind !== "init" || ![
                    "Literal", "FunctionExpression", "ArrowFunctionExpression"
                  ].includes(property.value.type);
                }) ||
                sourceCode.getCommentsInside(options).some((comment) => {
                  return !properties.some((property) => {
                    return comment.range[0] >= property.range[0] &&
                      comment.range[1] <= property.range[1];
                  });
                })
              ) {
                return null;
              }

              return properties.map((property, index) => {
                return fixer.replaceText(property, sourceCode.getText(sorted[index]));
              });
            }
          });
        });
      }
    };
  }
};
