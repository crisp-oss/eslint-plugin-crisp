module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce order of import groups",
      category: "Best Practices",
      recommended: false,
    },
    fixable: null, // This rule is not auto-fixable
  },

  create(context) {
    const groupOrder = [
      "NPM",
      "PROJECT: COMPONENTS",
      "PROJECT: POPUPS",
      "PROJECT: MIXINS",
      "PROJECT: FACTORIES",
      "PROJECT: HELPERS",
      "PROJECT: PLATFORMS",
      "PROJECT: LIBRARIES",
      // Add any other groups here
    ];

    let lastGroupIndex = -1;
    const existingGroups = new Set();

    function findGroupIndex(comment) {
      const group = comment.value.trim().toUpperCase();
      return groupOrder.indexOf(group);
    }

    function getRelativePositionMessage(currentGroupIndex, groupName) {
      // Search for the nearest group that is present in the file
      for (let i = currentGroupIndex - 1; i >= 0; i--) {
        if (existingGroups.has(groupOrder[i])) {
          return `should be after '${groupOrder[i]}' group`;
        }
      }
      for (let i = currentGroupIndex + 1; i < groupOrder.length; i++) {
        if (existingGroups.has(groupOrder[i])) {
          return `should be before '${groupOrder[i]}' group`;
        }
      }
      return "is out of order";
    }

    function checkGroupOrder(node, currentGroupIndex, groupName) {
      if (currentGroupIndex < lastGroupIndex) {
        const positionMessage = getRelativePositionMessage(currentGroupIndex, groupName);
        context.report({
          node,
          message: `Import group '${groupName}' ${positionMessage}.`,
        });
      }
      lastGroupIndex = Math.max(lastGroupIndex, currentGroupIndex);
      existingGroups.add(groupName);
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

    function updateAndCheckGroup(node) {
      const comments = context.getSourceCode().getCommentsBefore(node);
      for (let i = comments.length - 1; i >= 0; i--) {
        const comment = comments[i];
        if (isGroupComment(comment)) {
          const groupName = comment.value.trim().toUpperCase();
          const groupIndex = findGroupIndex(comment);
          if (groupIndex !== -1) {
            checkGroupOrder(node, groupIndex, groupName);
          }
          break;
        }
      }
    }

    return {
      ImportDeclaration: updateAndCheckGroup,
    };
  }
};
