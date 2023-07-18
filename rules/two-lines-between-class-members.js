// file: eslint-plugin-crisp/lib/rules/two-lines-between-class-members.js
module.exports = {
  meta: {
    type: "layout",
    docs: {
      description: "enforce two line breaks between class members",
      category: "Stylistic Issues",
      recommended: false,
    },
  },
  create(context) {
    return {
      MethodDefinition(node) {
        const sourceCode = context.getSourceCode();
        const lines = sourceCode.lines;

        const parent = node.parent;

        // Ensure we are in a class and not the first method
        if (parent && parent.type === "ClassBody" && parent.body[0] !== node) {
          const methodIndex = parent.body.indexOf(node);
          const previousMethod = parent.body[methodIndex - 1];
          const lineOfCurrentMethod = node.loc.start.line;
          const lineOfPreviousMethodEnd = previousMethod.loc.end.line;

          // Count the empty lines between the end of the previous method and the start of the current one
          let emptyLineCount = 0;
          for (let i = lineOfPreviousMethodEnd; i < lineOfCurrentMethod; i++) {
            if (lines[i].trim() === "" && !lines[i].includes("*")) {
              emptyLineCount++;
            }
          }

          // Report an error if there are not exactly two empty lines
          if (emptyLineCount !== 2) {
            context.report({
              node,
              message: "Expected exactly two line breaks between class methods.",
            });
          }
        }
      },
    };
  },
};
