const COMMENT_HEADER_FORMAT = (section) => {
  return `/**************************************************************************\n * ${section.toUpperCase()}\n ***************************************************************************/`;
};

function isTypeComment(comment) {
  if (comment.type !== "Block" || !comment.value.startsWith("*")) {
    return false;
  }

  const content = comment.value;

  return content.includes("@import") || content.includes("@typedef");
}

function isUppercaseConstant(declaration) {
  return (
    declaration &&
    declaration.id &&
    declaration.id.name &&
    declaration.id.name === declaration.id.name.toUpperCase()
  );
}

function isRegex(node) {
  if (node.type !== "VariableDeclaration") {
    return false;
  }

  for (const declaration of node.declarations) {
    if (declaration.init.type === "Literal" && declaration.init.regex != null) {
      return true;
    }

    if (
      declaration.init.type === "NewExpression" &&
      declaration.init.callee.name === "RegExp"
    ) {
      return true;
    }
  }

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
      (declaration.init.callee.object && (declaration.init.callee.object || {}).type === "MetaProperty" && declaration.init.callee.object.meta.type === "Identifier" && declaration.init.callee.object.meta.name === "import")
    )
  );
}

export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce file header comments",
      category: "Best Practices",
      recommended: false,
    },
    fixable: null,
  },

  create(context) {
    const filename = context.getFilename();

    if (!filename.endsWith(".js") && !filename.endsWith(".ts")) {
      return {};
    }

    let lastNode = null;
    let groupStart = null;

    const sourceCode = context.sourceCode || context.getSourceCode();
    const allBlockComments = sourceCode.getAllComments()
      .filter(c => c.type === "Block")
      .sort((a, b) => a.range[0] - b.range[0]);

    const typeComments = allBlockComments.filter(c => isTypeComment(c));

    function checkTypeCommentsGroup() {
      if (typeComments.length === 0) {
        return;
      }

      const firstTypeComment = typeComments[0];
      const typeCommentStart = firstTypeComment.range[0];

      let comment = null;

      for (let i = allBlockComments.length - 1; i >= 0; i--) {
        if (allBlockComments[i].range[1] < typeCommentStart) {
          comment = allBlockComments[i];

          break;
        }
      }

      if (!comment || `/*${comment.value.trim()}*/` !== COMMENT_HEADER_FORMAT("TYPES")) {
        context.report({
          loc: firstTypeComment.loc,
          message: "Type comments group must be preceded by a 'TYPES' comment block",
        });
      }
    }

    function checkGroup(nodeType, startNode) {
      // If a variable is not declared at the top level, don't enforce the comment
      if (nodeType === "VariableDeclaration" && startNode.parent.type !== "Program") {
        return;
      }

      // Find the nearest Block Comment before the startNode (using cached comments)
      const nodeStart = startNode.range[0];
      let comment = null;

      for (let i = allBlockComments.length - 1; i >= 0; i--) {
        if (allBlockComments[i].range[1] < nodeStart) {
          comment = allBlockComments[i];

          break;
        }
      }

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

        // Check type comments group
        checkTypeCommentsGroup();
      }
    };
  }
};
