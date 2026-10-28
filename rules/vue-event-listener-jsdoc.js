import doctrine from "doctrine";

const EVENT_LISTENERS_SEPARATOR = "--> EVENT LISTENERS <--";
const DESCRIPTION_PREFIX = "Triggers on ";

export default {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "require event listener method descriptions to start with 'Triggers on'",
      category: "Stylistic Issues",
      recommended: false
    },
    fixable: null,
    schema: [],
    messages: {
      invalidDescription:
        "Event listener method JSDoc description must start with " +
        "'Triggers on ...'.",
      missingJsdoc: "Event listener methods must have a JSDoc comment."
    }
  },

  create(context) {
    const sourceCode = context.sourceCode;

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

        if (!eventListenersStarted || property.type !== "Property") {
          return;
        }

        const jsdoc = [...comments].reverse().find((comment) => {
          return comment.type === "Block" && comment.value.startsWith("*");
        });

        if (!jsdoc) {
          context.report({
            node: property,
            messageId: "missingJsdoc"
          });

          return;
        }

        const description = doctrine.parse(
          `/*${jsdoc.value}*/`,
          { unwrap: true }
        ).description.trim();

        if (!description.startsWith(DESCRIPTION_PREFIX)) {
          context.report({
            node: jsdoc,
            messageId: "invalidDescription"
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
