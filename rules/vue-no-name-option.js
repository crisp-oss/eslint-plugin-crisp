export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "disallow explicit names in Vue single-file components",
      category: "Best Practices",
      recommended: false
    },
    fixable: "code",
    schema: []
  },

  create(context) {
    const fileName = (context.filename || context.getFilename()).replace(/\\/g, "/");

    if (!fileName.endsWith(".vue")) {
      return {};
    }

    return {
      ExportDefaultDeclaration(node) {
        const componentOptions = getComponentOptions(node.declaration);

        if (!componentOptions) {
          return;
        }

        componentOptions.properties.forEach((property) => {
          if (!isNameProperty(property)) {
            return;
          }

          context.report({
            node: property,
            message: "Vue single-file components must rely on their inferred filename.",

            fix(fixer) {
              return removeProperty(fixer, context, componentOptions, property);
            }
          });
        });
      }
    };
  }
};

// Returns the component options passed to defineComponent()
function getComponentOptions(node) {
  if (!isDefineComponentCall(node)) {
    return null;
  }

  const options = node.arguments[0];

  return options?.type === "ObjectExpression" ? options : null;
}

// Returns whether the node is a defineComponent() call
function isDefineComponentCall(node) {
  if (!node || node.type !== "CallExpression") {
    return false;
  }

  if (node.callee.type === "Identifier") {
    return node.callee.name === "defineComponent";
  }

  return (
    node.callee.type === "MemberExpression" &&
    node.callee.property.type === "Identifier" &&
    node.callee.property.name === "defineComponent"
  );
}

// Returns whether the property is the component name option
function isNameProperty(property) {
  if (property.type !== "Property") {
    return false;
  }

  if (property.key.type === "Identifier") {
    return property.key.name === "name";
  }

  return property.key.type === "Literal" && property.key.value === "name";
}

// Removes a property and its adjacent comma
function removeProperty(fixer, context, options, property) {
  const sourceCode = context.sourceCode || context.getSourceCode();
  const nextToken = sourceCode.getTokenAfter(property);

  if (nextToken?.value === ",") {
    return fixer.removeRange([property.range[0], nextToken.range[1]]);
  }

  const propertyIndex = options.properties.indexOf(property);

  if (propertyIndex > 0) {
    const previousToken = sourceCode.getTokenBefore(property);

    if (previousToken?.value === ",") {
      return fixer.removeRange([previousToken.range[0], property.range[1]]);
    }
  }

  return fixer.remove(property);
}
