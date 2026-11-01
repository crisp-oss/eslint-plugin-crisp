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

// Checks an empty object or array literal (eg. `{}` or `[]`)
function isEmptyLiteral(node) {
  return (
    (node.type === "ObjectExpression" && node.properties.length === 0) ||
    (node.type === "ArrayExpression" && node.elements.length === 0)
  );
}

// Checks a fallback expression like `value || "none"` or `value ?? other`
function isFallback(node) {
  node = unwrapTransparentExpression(node);

  if (
    !node ||
    node.type !== "LogicalExpression" ||
    (node.operator !== "||" && node.operator !== "??")
  ) {
    return false;
  }

  const isOperandValid = (operand) => {
    operand = unwrapTransparentExpression(operand);

    return (
      operand.type === "Literal" ||
      isEmptyLiteral(operand) ||
      isReference(operand) ||
      isFallback(operand)
    );
  };

  return isReference(node.left) || isFallback(node.left)
    ? isOperandValid(node.right)
    : false;
}

// Checks a logger argument value is a reference, a fallback or an object of those
function isAllowedValue(node) {
  return isReference(node) || isFallback(node) || isReferenceObject(node);
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

    return isAllowedValue(property.value);
  });
}

// Checks a node is a `logger.levels.<level>` member expression
function isLevelsReference(node) {
  node = unwrapTransparentExpression(node);

  return (
    Boolean(node) &&
    node.type === "MemberExpression" &&
    node.object.type === "MemberExpression" &&
    getPropertyName(node.object) === "levels" &&
    node.object.object.type === "MemberExpression" &&
    getPropertyName(node.object.object) === "logger"
  );
}

// Checks a condition tests a logger level (eg. `logger.levels.error === true && x`)
function isLevelCheck(node) {
  node = unwrapTransparentExpression(node);

  if (!node) {
    return false;
  }

  if (node.type === "LogicalExpression" && node.operator === "&&") {
    return isLevelCheck(node.left) || isLevelCheck(node.right);
  }

  if (
    node.type === "BinaryExpression" &&
    (node.operator === "===" || node.operator === "==")
  ) {
    return isLevelsReference(node.left) || isLevelsReference(node.right);
  }

  return isLevelsReference(node);
}

// Checks a node is inside the consequent of a logger level guard
function isGuarded(ancestors, node) {
  const chain = [...ancestors, node];

  for (let index = chain.length - 2; index >= 0; index--) {
    const ancestor = chain[index];

    if (
      ancestor.type === "IfStatement" &&
      chain[index + 1] === ancestor.consequent &&
      isLevelCheck(ancestor.test)
    ) {
      return true;
    }
  }

  return false;
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
        "Logger interpolation arguments must be references, fallbacks (`||`, `??`) or inline objects of those, not computed expressions."
    }
  },

  create(context) {
    const sourceCode = context.sourceCode;

    return {
      CallExpression(node) {
        if (!isLoggerCall(node)) {
          return;
        }

        // Guarded by a log level check: computed values are allowed
        if (isGuarded(sourceCode.getAncestors(node), node)) {
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
          if (!isAllowedValue(value)) {
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
