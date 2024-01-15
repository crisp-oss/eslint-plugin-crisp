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
      // Add any other known groups here
    ];

    let lastKnownGroupIndex = -1;
    const existingGroups = new Set();
    const sourceCode = context.getSourceCode();

    function findGroupIndex(comment) {
      const group = comment.value.trim().toUpperCase();
      return groupOrder.indexOf(group);
    }

    function getRelativePositionMessage(currentGroupIndex, groupName) {
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

    function hasKnownGroupAfter(node) {
      let followingNode = node;
      while (followingNode = sourceCode.getTokenAfter(followingNode, { includeComments: true })) {
        if (followingNode.type === 'Line') {
          if (isGroupComment(followingNode)) {
            const groupIndex = findGroupIndex(followingNode);

            if (groupIndex !== -1) {
              return true;
            }
          }
        }

        if (followingNode.type === 'ImportDeclaration') {
          const commentsBefore = sourceCode.getCommentsBefore(followingNode);
          for (let i = commentsBefore.length - 1; i >= 0; i--) {
            const comment = commentsBefore[i];
            if (isGroupComment(comment)) {
              const groupIndex = findGroupIndex(comment);
              if (groupIndex !== -1) {
                return true;
              }
              break;
            }
          }
        }
      }
      return false;
    }

    function checkGroupOrder(node, currentGroupIndex, groupName) {
      if (currentGroupIndex === -1) { // Unknown group
        if (hasKnownGroupAfter(node)) {
          context.report({
            node,
            message: `Unknown import group '${groupName}' should be after all known groups.`,
          });
        }
      } else if (currentGroupIndex < lastKnownGroupIndex) {
        const positionMessage = getRelativePositionMessage(currentGroupIndex, groupName);
        context.report({
          node,
          message: `Import group '${groupName}' ${positionMessage}.`,
        });
      }

      if (currentGroupIndex !== -1) {
        lastKnownGroupIndex = Math.max(lastKnownGroupIndex, currentGroupIndex);
      }

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

          checkGroupOrder(node, groupIndex, groupName);

          break;
        }
      }
    }

    return {
      ImportDeclaration: updateAndCheckGroup,
    };
  }
};
