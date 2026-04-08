function isTypeComment(comment) {
  return (
    comment.type === "Block" &&
    comment.value.startsWith("*") &&
    (comment.value.includes("@import") || comment.value.includes("@typedef"))
  );
}

function isTypesGroupComment(comment) {
  return comment.type === "Line" && comment.value.trim() === "TYPES";
}

function isGroupComment(comment) {
  return (
    comment.type === "Line" &&
    (
      comment.value.trim().startsWith("PROJECT:") ||
      comment.value.trim().startsWith("NPM") ||
      comment.value.trim().startsWith("TYPES")
    )
  );
}

function isIgnoreComment(comment) {
  return (
    comment.type === "Line" &&
    comment.value.trim().startsWith("@ts-ignore")
  );
}

function getDirectoryName(filePath) {
  const pathParts = filePath.split("/");

  return pathParts[pathParts.length - 2].toUpperCase();
}

function generateExpectedComment(group) {
  if (group === "NPM") {
    return group;
  }

  if (group === "SRC") {
    group = "MAIN";
  }

  return `PROJECT: ${group}`;
}

export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce import statements to be grouped and preceded by a comment",
      category: "Best Practices",
      recommended: false,
    },
    schema: [
      {
        type: "object",
        additionalProperties: {
          type: "string",
        },
      },
    ],
    fixable: null,  // This rule is not auto-fixable
  },

  create(context) {
    const customGroups = context.options[0] || {};  // Get custom groups from options

    // Pre-compile custom regexes once instead of on every import
    const compiledCustomGroups = Object.entries(customGroups).map(([regexStr, group]) => {
      return [new RegExp(regexStr), group];
    });

    let currentGroupComment = null;

    function extractGroupFromPath(path, filePath) {
      // Check custom regexes first (using pre-compiled patterns)
      for (const [regex, group] of compiledCustomGroups) {
        if (regex.test(path)) {
          return group;
        }
      }

      // Relative path import?
      if (path.startsWith("./")) {
        return getDirectoryName(filePath);
      }

      // Alias path import?
      if (path.startsWith("@/") || path.startsWith("@shared/")) {
        const parts = path.split("/");

        if (parts.length === 2) {
          return "MAIN";
        }

        return parts[1].toUpperCase();
      }

      return "NPM";
    }

    function updateCurrentGroupComment(node) {
      const comments = context.getSourceCode().getCommentsBefore(node);

      if (comments.length > 0) {
        for (let i = comments.length - 1; i >= 0; i--) {
          if (isIgnoreComment(comments[i])) {
            continue;
          }

          if (isGroupComment(comments[i])) {
            currentGroupComment = comments[i];

            break;
          }
        }
      }
    }

    function checkImportGroup(node) {
      const importPath = node.source.value;
      const filePath = context.getFilename();

      // Get group from import path
      const expectedGroup = extractGroupFromPath(importPath, filePath);
      const expectedComment = generateExpectedComment(expectedGroup);

      // Get comment for current group
      updateCurrentGroupComment(node);

      if (!currentGroupComment || !currentGroupComment.value.toUpperCase().includes(expectedComment.toUpperCase())) {
        context.report({
          node,
          message: `Import "${importPath}" should be in the "${expectedComment}" group.`,
        });
      }
    }

    const sourceCode = context.sourceCode || context.getSourceCode();
    const allComments = sourceCode.getAllComments();
    const typeComments = allComments.filter(c => isTypeComment(c));

    function checkTypeCommentsGroup() {
      const filename = context.getFilename();

      // Only check for // TYPES in .vue files (block header is checked by header-comments-check rule for .js/.ts)
      if (!filename.endsWith(".vue")) {
        return;
      }

      if (typeComments.length === 0) {
        return;
      }

      const firstTypeComment = typeComments[0];
      const typeCommentStart = firstTypeComment.range[0];

      let comment = null;

      for (let i = allComments.length - 1; i >= 0; i--) {
        if (allComments[i].range[1] < typeCommentStart) {
          comment = allComments[i];

          break;
        }
      }

      if (!comment || !isTypesGroupComment(comment)) {
        context.report({
          loc: firstTypeComment.loc,
          message: "Type comments group must be preceded by a '// TYPES' comment",
        });
      }
    }

    return {
      ImportDeclaration: checkImportGroup,

      "Program:exit": () => {
        checkTypeCommentsGroup();
      }
    };
  }
};
