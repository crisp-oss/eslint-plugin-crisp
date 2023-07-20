module.exports = {
  meta: {
    type: "layout",
    docs: {
      description: "disallow trailing whitespace at the end of lines",
      category: "Stylistic Issues",
      recommended: true,
    },
  },
  create(context) {
    const sourceCode = context.getSourceCode();

    return {
      Program() {
        const lines = sourceCode.lines;

        lines.forEach((line, index) => {
          if (/\s+$/u.test(line)) {
            context.report({
              loc: {
                start: { line: index + 1, column: line.length },
                end: { line: index + 1, column: line.length }
              },
              message: "Trailing spaces not allowed."
            });
          }
        });
      }
    };
  }
};
