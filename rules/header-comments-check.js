module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce file header comments",
      category: "Best Practices",
      recommended: false,
    },
    fixable: null,  // This rule is not auto-fixable
  },

  create(context) {
    const filename = context.getFilename();

    // Only apply this rule to .js files
    if (!filename.endsWith(".js")) {
      return {};
    }

    let lastNodeType = null;
    let groupStart = null;

    // This function formats the section string into a comment block header
    const COMMENT_HEADER_FORMAT = (section) => {
      return `/**************************************************************************\n * ${section.toUpperCase()}\n ***************************************************************************/`;
    };

    // Checks if a variable declaration is an import or require
    function isImportOrRequire(declaration) {
      return (
        declaration.init &&
        declaration.init.type === "CallExpression" &&
        (
          (declaration.init.callee.name && declaration.init.callee.name === "require") ||
          (declaration.init.callee.type && declaration.init.callee.type === "Import") ||
          (declaration.init.callee.object && (declaration.init.callee.object || {}).type === 'MetaProperty' && declaration.init.callee.object.meta.type === 'Identifier' && declaration.init.callee.object.meta.name === 'import')
        )
      );
    }

    function checkGroup(nodeType, startNode) {
      // If a variable is not declared at the top level, don't enforce the comment
      if (nodeType === "VariableDeclaration" && startNode.parent.type !== "Program") {
        return;
      }

      // Find the nearest Block Comment before the startNode
      const tokens = context.getSourceCode().getTokensBefore(startNode, {includeComments: true});
      const comment = tokens.reverse().find(token => token.type === "Block");

      // Different types of nodes require different comment blocks
      switch (nodeType) {
        case "ImportDeclaration": {
          if (!comment || `/*${comment.value.trim()}*/` !== COMMENT_HEADER_FORMAT("IMPORTS")) {
            context.report({
              node: startNode,
              message: "Import group must be preceded by a 'IMPORTS' comment block",
            });
          }

          break;
        }

        case "VariableDeclaration": {
          if (startNode.kind === "const") {
            if (startNode.declarations.some(d => d.init && d.init.regex)) {
              if (!comment || `/*${comment.value.trim()}*/` !== COMMENT_HEADER_FORMAT("INSTANCES")) {
                context.report({
                  node: startNode,
                  message: "Regex group must be preceded by a 'INSTANCES' comment block",
                });
              }
            } else if (
              (!comment || `/*${comment.value.trim()}*/` !== COMMENT_HEADER_FORMAT("CONSTANTS")) &&
              !startNode.declarations.some(isImportOrRequire)
            ) {
              context.report({
                node: startNode,
                message: "Variable group must be preceded by a 'CONSTANTS' comment block",
              });
            }
          }

          break;
        }

        case "NewExpression": {
          if (!comment || `/*${comment.value.trim()}*/` !== COMMENT_HEADER_FORMAT("INSTANCES")) {
            context.report({
              node: startNode,
              message: "Regex group must be preceded by a 'INSTANCES' comment block",
            });
          }

          break;
        }

        case "ExportDefaultDeclaration": {
          // Only enforce the 'EXPORTS' comment block if it's the last statement in the file
          if (startNode !== context.getSourceCode().ast.body.slice(-1)[0] && (!comment || `/*${comment.value.trim()}*/` !== COMMENT_HEADER_FORMAT("EXPORTS"))) {
            context.report({
              node: startNode,
              message: "Export group must be preceded by a 'EXPORTS' comment block",
            });
          }

          break;
        }
      }
    }

    return {
      ":statement": (node) => {
        const nodeType = node.type;
        // If the type of node has changed since last time, check the group starting with the last node
        if (nodeType !== lastNodeType) {
          if (groupStart) {
            checkGroup(lastNodeType, groupStart);
          }
          groupStart = node;
        }
        lastNodeType = nodeType;
      },

      "Program:exit": () => {
        // When the program exits, check the group starting with the last node
        if (groupStart) {
          checkGroup(lastNodeType, groupStart);
        }
      }
    };
  }
};
