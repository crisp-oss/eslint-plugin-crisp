const VALID_SIGNATURES = [
  [],
  ["value"],
  ["newValue", "oldValue"]
];

function getPropertyName(property) {
  if (property.computed) {
    return null;
  }

  if (property.key.type === "Identifier") {
    return property.key.name;
  }

  return property.key.value;
}

function hasValidSignature(handler) {
  return VALID_SIGNATURES.some((signature) => {
    return (
      handler.params.length === signature.length &&
      handler.params.every((parameter, index) => {
        return (
          parameter.type === "Identifier" &&
          parameter.name === signature[index]
        );
      })
    );
  });
}

export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "enforce Vue watcher handler form and signature",
      category: "Stylistic Issues",
      recommended: false
    },
    fixable: null,
    schema: [],
    messages: {
      objectForm: "Watchers must use the object form with a `handler` function.",
      missingHandler: "Watcher objects must define a `handler` function.",
      invalidHandler: "Watcher `handler` must be a function.",
      invalidSignature:
        "Watcher `handler` must use one of these signatures: " +
        "`handler()`, `handler(value)`, or `handler(newValue, oldValue)`."
    }
  },

  create(context) {
    return {
      'Property[key.name="watch"] > ObjectExpression'(node) {
        node.properties.forEach((watcher) => {
          if (watcher.type !== "Property") {
            return;
          }

          if (watcher.value.type !== "ObjectExpression") {
            context.report({
              node: watcher,
              messageId: "objectForm"
            });

            return;
          }

          const handlerProperty = watcher.value.properties.find((property) => {
            return (
              property.type === "Property" &&
              getPropertyName(property) === "handler"
            );
          });

          if (!handlerProperty) {
            context.report({
              node: watcher,
              messageId: "missingHandler"
            });

            return;
          }

          const handler = handlerProperty.value;

          if (
            handlerProperty.kind !== "init" ||
            (
              handler.type !== "FunctionExpression" &&
              handler.type !== "ArrowFunctionExpression"
            )
          ) {
            context.report({
              node: handlerProperty,
              messageId: "invalidHandler"
            });

            return;
          }

          if (!hasValidSignature(handler)) {
            context.report({
              node: handlerProperty,
              messageId: "invalidSignature"
            });
          }
        });
      }
    };
  }
};
