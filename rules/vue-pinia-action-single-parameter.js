const MESSAGE_ID = "singlePayloadArgument";

export default {
  meta: {
    type: "problem",
    docs: {
      description: "Require Pinia actions to accept at most one payload argument",
      category: "Possible Errors",
      recommended: true
    },
    schema: [],
    messages: {
      [MESSAGE_ID]: "Pinia actions must accept at most one payload argument. Wrap multiple values in an object."
    }
  },

  create(context) {
    const sourceCode = context.sourceCode || context.getSourceCode();
    const defineStoreImports = collectDefineStoreImports(sourceCode.ast);

    return {
      CallExpression(node) {
        if (!isImportedDefineStoreCall(node, sourceCode, defineStoreImports)) {
          return;
        }

        const options = node.arguments[1];

        if (!options || options.type !== "ObjectExpression") {
          return;
        }

        const actions = findObjectProperty(options, "actions");

        if (!actions || actions.value.type !== "ObjectExpression") {
          return;
        }

        for (const property of actions.value.properties) {
          const action = getActionFunction(property);

          if (
            action &&
            (
              action.params.length > 1 ||
              action.params.some((parameter) => parameter.type === "RestElement")
            )
          ) {
            context.report({
              node: action,
              messageId: MESSAGE_ID
            });
          }
        }
      }
    };
  }
};

// Collects local bindings for named defineStore imports from Pinia
function collectDefineStoreImports(program) {
  const imports = new Map();

  for (const node of program.body) {
    if (node.type !== "ImportDeclaration" || node.source.value !== "pinia") {
      continue;
    }

    for (const specifier of node.specifiers) {
      if (
        specifier.type === "ImportSpecifier" &&
        getImportedName(specifier) === "defineStore"
      ) {
        imports.set(specifier.local.name, specifier);
      }
    }
  }

  return imports;
}

// Returns the imported name for JavaScript and TypeScript ESTree nodes
function getImportedName(specifier) {
  return specifier.imported.name || specifier.imported.value;
}

// Checks that a call resolves to the collected Pinia import, rather than a shadow
function isImportedDefineStoreCall(node, sourceCode, defineStoreImports) {
  if (
    node.callee.type !== "Identifier" ||
    !defineStoreImports.has(node.callee.name)
  ) {
    return false;
  }

  const expectedSpecifier = defineStoreImports.get(node.callee.name);
  let scope = sourceCode.getScope(node);

  while (scope) {
    const variable = scope.variables.find(({ name }) => name === node.callee.name);

    if (variable) {
      return variable.defs.some((definition) => {
        return (
          definition.type === "ImportBinding" &&
          definition.node === expectedSpecifier
        );
      });
    }

    scope = scope.upper;
  }

  return false;
}

// Finds a direct, statically named property in an object expression
function findObjectProperty(object, name) {
  return object.properties.find((property) => {
    return (
      property.type === "Property" &&
      property.kind === "init" &&
      getStaticPropertyName(property) === name
    );
  });
}

// Returns a property's static name, including quoted property names
function getStaticPropertyName(property) {
  if (!property.computed && property.key.type === "Identifier") {
    return property.key.name;
  }

  if (property.key.type === "Literal") {
    return property.key.value;
  }

  return null;
}

// Returns a directly declared action function
function getActionFunction(property) {
  if (
    property.type !== "Property" ||
    property.kind !== "init"
  ) {
    return null;
  }

  if (
    property.value.type === "FunctionExpression" ||
    property.value.type === "ArrowFunctionExpression"
  ) {
    return property.value;
  }

  return null;
}
