const LOGGER_METHODS = new Set([
  "debug",
  "error",
  "fatal",
  "info",
  "log",
  "trace",
  "warn"
]);

function getPropertyName(node) {
  if (!node || node.type !== "MemberExpression") {
    return null;
  }

  if (!node.computed && node.property.type === "Identifier") {
    return node.property.name;
  }

  if (
    node.computed &&
    node.property.type === "Literal" &&
    typeof node.property.value === "string"
  ) {
    return node.property.value;
  }

  return null;
}

function isLoggerCall(node) {
  if (
    node.callee.type !== "MemberExpression" ||
    !LOGGER_METHODS.has(getPropertyName(node.callee))
  ) {
    return false;
  }

  return (
    node.callee.object.type === "MemberExpression" &&
    getPropertyName(node.callee.object) === "logger"
  );
}

function unwrapTransparentExpression(node) {
  while (
    node &&
    (
      node.type === "ChainExpression" ||
      node.type === "TSAsExpression" ||
      node.type === "TSInstantiationExpression" ||
      node.type === "TSNonNullExpression" ||
      node.type === "TSTypeAssertion"
    )
  ) {
    node = node.expression;
  }

  return node;
}

function isReference(node) {
  node = unwrapTransparentExpression(node);

  if (!node) {
    return false;
  }

  if (
    node.type === "Identifier" ||
    node.type === "MetaProperty" ||
    node.type === "Super" ||
    node.type === "ThisExpression"
  ) {
    return true;
  }

  if (node.type !== "MemberExpression" || !isReference(node.object)) {
    return false;
  }

  if (!node.computed) {
    return (
      node.property.type === "Identifier" ||
      node.property.type === "PrivateIdentifier"
    );
  }

  const property = unwrapTransparentExpression(node.property);

  return (
    property.type === "Literal" ||
    isReference(property)
  );
}

// Checks an inline object only contains references (no computed values)
function isReferenceObject(node) {
  node = unwrapTransparentExpression(node);

  if (!node || node.type !== "ObjectExpression") {
    return false;
  }

  return node.properties.every((property) => {
    if (property.type === "SpreadElement") {
      return isReference(property.argument);
    }

    if (property.type !== "Property" || property.kind !== "init") {
      return false;
    }

    if (property.computed && !isReference(property.key)) {
      return false;
    }

    return isReference(property.value) || isReferenceObject(property.value);
  });
}

export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "enforce static logger messages and reference arguments",
      category: "Best Practices",
      recommended: false
    },
    schema: [],
    messages: {
      message:
        "Logger messages must be single-line, double-quoted string literals.",
      reference:
        "Logger interpolation arguments must be references or inline objects of references, not computed expressions."
    }
  },

  create(context) {
    const sourceCode = context.sourceCode;

    return {
      CallExpression(node) {
        if (!isLoggerCall(node)) {
          return;
        }

        const [message, ...values] = node.arguments;

        if (
          !message ||
          message.type !== "Literal" ||
          typeof message.value !== "string" ||
          message.loc.start.line !== message.loc.end.line ||
          !sourceCode.getText(message).startsWith("\"")
        ) {
          context.report({
            node: message || node,
            messageId: "message"
          });
        }

        for (const value of values) {
          if (!isReference(value) && !isReferenceObject(value)) {
            context.report({
              node: value,
              messageId: "reference"
            });
          }
        }
      }
    };
  }
};
