export default {
  meta: {
    type: "problem",
    docs: {
      description: "align consecutive assignment statements in a class",
      category: "Stylistic Issues",
      recommended: false,
    },
    fixable: null,
    schema: [],
  },

  create: function (context) {
    let sourceCode = context.getSourceCode();
    let currentBlock = [];
    let maxColumn = 0;

    function reportMisalignedAssignments(assignments, maxColumn) {
      assignments.forEach(node => {
        let alignmentColumn = sourceCode.getText(node).indexOf("=") + node.loc.start.column;
        if (alignmentColumn < maxColumn) {
          context.report({
            node: node,
            message: `Assignment of '${sourceCode.getText(node.left).trim()}' at line ${node.loc.start.line} column ${alignmentColumn + 1} should be aligned at column ${maxColumn + 1}`,
          });
        }
      });
    }

    function handleAssignmentExpression(node) {
      // Ensure we're only dealing with assignments directly in constructors
      if (!node.parent || node.parent.type !== "ExpressionStatement" ||
          !node.parent.parent || node.parent.parent.type !== "BlockStatement" ||
          !node.parent.parent.parent || node.parent.parent.parent.type !== "FunctionExpression" ||
          !node.parent.parent.parent.parent || node.parent.parent.parent.parent.type !== "MethodDefinition" ||
          node.parent.parent.parent.parent.kind !== "constructor") {
        return;
      }

      if (currentBlock.length > 0) {
        const prevNode = currentBlock[currentBlock.length - 1];

        if (prevNode.loc.end.line !== node.loc.start.line - 1) {
          if (currentBlock.length > 1) {
            reportMisalignedAssignments(currentBlock, maxColumn);
          }

          currentBlock = [];
          maxColumn = 0;
        }
      }

      currentBlock.push(node);
      let currentAssignmentColumn = sourceCode.getText(node).indexOf("=") + node.loc.start.column;
      maxColumn = Math.max(maxColumn, currentAssignmentColumn);
    }


    return {
      AssignmentExpression: handleAssignmentExpression,
      "MethodDefinition:exit": function () {
        if (currentBlock.length > 1) {
          reportMisalignedAssignments(currentBlock, maxColumn);
        }

        currentBlock = [];
        maxColumn = 0;
      },
      "Program:exit": function () {
        if (currentBlock.length > 1) {
          reportMisalignedAssignments(currentBlock, maxColumn);
        }
      }
    };
  },
};
