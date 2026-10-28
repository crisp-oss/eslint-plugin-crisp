const EVENT_LISTENERS_SEPARATOR = "--> EVENT LISTENERS <--";
const EVENT_LISTENER_NAME_PATTERN = /^on[A-Z]/;

export default {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "require on-prefixed Vue methods to be in the event listeners section",
      category: "Stylistic Issues",
      recommended: false
    },
    fixable: null,
    schema: [],
    messages: {
      wrongSection:
        "Method '{{name}}' must be declared in the EVENT LISTENERS section."
    }
  },

  create(context) {
    const sourceCode = context.sourceCode;

    function getPropertyName(property) {
      if (property.type !== "Property" || property.computed) {
        return null;
      }

      if (property.key.type === "Identifier") {
        return property.key.name;
      }

      if (
        property.key.type === "Literal" &&
        typeof property.key.value === "string"
      ) {
        return property.key.value;
      }

      return null;
    }

    function checkMethods(node) {
      const properties = node.value.properties;

      if (!properties) {
        return;
      }

      let eventListenersStarted = false;

      properties.forEach((property) => {
        const comments = sourceCode.getCommentsBefore(property);

        if (!eventListenersStarted) {
          eventListenersStarted = comments.some((comment) => {
            return (
              comment.type === "Line" &&
              comment.value.trim() === EVENT_LISTENERS_SEPARATOR
            );
          });
        }

        if (eventListenersStarted) {
          return;
        }

        const name = getPropertyName(property);

        if (name && EVENT_LISTENER_NAME_PATTERN.test(name)) {
          context.report({
            node: property.key,
            messageId: "wrongSection",
            data: { name }
          });
        }
      });
    }

    return {
      'ExportDefaultDeclaration > ObjectExpression > Property[key.name="methods"]':
        checkMethods,
      'ExportDefaultDeclaration > CallExpression[callee.name="defineComponent"] > ObjectExpression > Property[key.name="methods"]':
        checkMethods
    };
  }
};
