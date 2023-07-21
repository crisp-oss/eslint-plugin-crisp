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

    let lastNode = null;
    let groupStart = null;

    // This function formats the section string into a comment block header
    const COMMENT_HEADER_FORMAT = (section) => {
      return `/**************************************************************************\n * ${section.toUpperCase()}\n ***************************************************************************/`;
    };

    function isUppercaseConstant(declaration) {
      return (
        declaration &&
        declaration.id &&
        declaration.id.name &&
        declaration.id.name === declaration.id.name.toUpperCase()
      );
    }

    function isRegex(node) {
      // Check if the node is a variable declaration
      if (node.type !== "VariableDeclaration") {
        return false;
      };

      // For each of the declarations in the variable declaration
      for (const declaration of node.declarations) {
        // If the initializer is a regex literal, return true
        if (declaration.init.type === "Literal" && declaration.init.regex != null) {
          return true;
        }

        // If the initializer is a new RegExp expression, return true
        if (
          declaration.init.type === "NewExpression" &&
          declaration.init.callee.name === "RegExp"
        ) {
          return true;
        }
      }

      // If none of the declarations are regexes, return false
      return false;
    }

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
            if (isRegex(startNode)) {
              if (!comment || `/*${comment.value.trim()}*/` !== COMMENT_HEADER_FORMAT("INSTANCES")) {
                context.report({
                  node: startNode,
                  message: "Regex group must be preceded by a 'INSTANCES' comment block",
                });
              }
            } else if (
              (!comment || `/*${comment.value.trim()}*/` !== COMMENT_HEADER_FORMAT("CONSTANTS")) &&
              startNode.declarations.some(isUppercaseConstant) &&
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
        // If the type of node has changed since last time, or if we have a \
        //   regex declaration and the previous declaration wasn't one
        if (node.type !== lastNode || isRegex(node) !== isRegex(lastNode)) {
          // Check the group starting with the last node
          if (groupStart) {
            checkGroup(lastNode.type, groupStart);
          }

          groupStart = node;
        }

        lastNode = node;
      },

      "Program:exit": () => {
        // When the program exits, check the group starting with the last node
        if (groupStart) {
          checkGroup(lastNode.type, groupStart);
        }
      }
    };
  }
};
