module.exports = {
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

    let currentGroupComment = null;

    // Extract the directory name from the file path
    function getDirectoryName(filePath) {
      const pathParts = filePath.split('/');
      return pathParts[pathParts.length - 2].toUpperCase(); // Directory name
    }

    function extractGroupFromPath(path, filePath) {
      // Check custom regexes first
      for (const regexStr in customGroups) {
        if (new RegExp(regexStr).test(path)) {
          return customGroups[regexStr];
        }
      }

      // Relative path import?
      if (path.startsWith("./")) {
        return getDirectoryName(filePath);
      }

      // Alias path import?
      if (path.startsWith("@/")) {
        const parts = path.split("/");

        if (parts.length === 2) {
          return "MAIN";
        }

        return parts[1].toUpperCase();
      }

      return "NPM";
    }

    function generateExpectedComment(group) {
      if (group === "NPM") {
        return group;
      }

      return `PROJECT: ${group}`;
    }

    function isGroupComment(comment) {
      return (
        comment.type === "Line" &&
        (
          comment.value.trim().startsWith("PROJECT:") ||
          comment.value.trim().startsWith("NPM")
        )
      );
    }

    function isIgnoreComment(comment) {
      // Skip some comments
      return (
        comment.type === "Line" &&
        comment.value.trim().startsWith("@ts-ignore")
      );
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

    return {
      ImportDeclaration: checkImportGroup,
    };
  }
};
