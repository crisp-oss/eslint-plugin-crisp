export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "enforce defineComponent wrapper for Vue mixins and components",
      category: "Best Practices",
      recommended: false
    },
    fixable: "code",
    schema: []
  },

  create(context) {
    const fileName = (context.filename || context.getFilename()).replace(/\\/g, "/");

    if (fileName.endsWith("/index.js") || !isVueComponentOrMixin(fileName)) {
      return {};
    }

    return {
      ExportDefaultDeclaration(node) {
        if (isDefineComponentCall(node.declaration)) {
          return;
        }

        context.report({
          node: node.declaration,
          message: "Mixins and components must use the `defineComponent` wrapper.",

          fix(fixer) {
            return buildFixes(fixer, context, node);
          }
        });
      }
    };
  }
};

// Returns whether the file is a Vue component or mixin
function isVueComponentOrMixin(fileName) {
  return (
    fileName.endsWith(".vue") ||
    /Mixin\.js$/i.test(fileName) ||
    fileName.includes("/mixins/")
  );
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

// Builds wrap + import fixes for a plain object default export
function buildFixes(fixer, context, exportNode) {
  if (exportNode.declaration.type !== "ObjectExpression") {
    return null;
  }

  const sourceCode = context.sourceCode || context.getSourceCode();
  const importFix = buildDefineComponentImportFix(fixer, sourceCode);

  if (importFix === false) {
    return null;
  }

  const declarationText = sourceCode.getText(exportNode.declaration);
  const fixes = [
    fixer.replaceText(
      exportNode.declaration,
      `defineComponent(${declarationText})`
    )
  ];

  if (importFix) {
    fixes.unshift(importFix);
  }

  return fixes;
}

// Extends an existing named import from "vue" when needed
function buildDefineComponentImportFix(fixer, sourceCode) {
  const body = sourceCode.ast.body;
  const vueImport = body.find((node) => {
    return node.type === "ImportDeclaration" && node.source.value === "vue";
  });

  if (!vueImport) {
    return false;
  }

  const alreadyImported = vueImport.specifiers.some((specifier) => {
    if (specifier.type !== "ImportSpecifier") {
      return false;
    }

    const importedName = specifier.imported.name || specifier.imported.value;

    return importedName === "defineComponent";
  });

  if (alreadyImported) {
    return null;
  }

  const namedSpecifiers = vueImport.specifiers.filter((specifier) => {
    return specifier.type === "ImportSpecifier";
  });

  if (namedSpecifiers.length === 0) {
    return false;
  }

  return fixer.insertTextAfter(
    namedSpecifiers[namedSpecifiers.length - 1],
    ", defineComponent"
  );
}
