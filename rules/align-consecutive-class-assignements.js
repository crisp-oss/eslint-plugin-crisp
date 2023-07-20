module.exports = {
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
        let alignmentColumn = sourceCode.getText(node).indexOf('=') + node.loc.start.column;
        if (alignmentColumn < maxColumn) {
          context.report({
            node: node,
            message: `Assignment of '${sourceCode.getText(node.left).trim()}' at line ${node.loc.start.line} column ${alignmentColumn + 1} should be aligned at column ${maxColumn + 1}`,
          });
        }
      });
    }

    function handleAssignmentExpression(node) {
      if (node.parent.type !== 'BlockStatement') {
        // If the assignment is not part of a block (like in a for loop initializer),
        // it should not be considered for alignment with other assignments in the block.
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
      let currentAssignmentColumn = sourceCode.getText(node).indexOf('=') + node.loc.start.column;
      maxColumn = Math.max(maxColumn, currentAssignmentColumn);
    }


    return {
      AssignmentExpression: handleAssignmentExpression,
      'MethodDefinition:exit': function () {
        if (currentBlock.length > 1) {
          reportMisalignedAssignments(currentBlock, maxColumn);
        }

        currentBlock = [];
        maxColumn = 0;
      },
      'Program:exit': function () {
        if (currentBlock.length > 1) {
          reportMisalignedAssignments(currentBlock, maxColumn);
        }
      }
    };
  },
};
