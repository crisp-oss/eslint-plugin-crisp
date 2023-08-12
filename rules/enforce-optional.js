module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Enforce the use of optional chaining",
      category: "Possible Errors",
      recommended: false,
    },
    schema: [], // no options
  },

  create(context) {
    const sourceCode = context.getSourceCode();
    // Search for `foo && foo.` or `foo && foo[`
    // Notice: do not match `foo && foo.bar !==` or `foo && foo[bar] !==`, \
    //   as the optional version would be unsafe
    const pattern = /\b(\w\S+)\s&&\s+\1\b[\[\.](?!\w\S+\s\!\=\=)/g;

    return {
      Program() {
        const text = sourceCode.getText();

        let match;

        while ((match = pattern.exec(text)) !== null) {
          const start = match.index;
          const end = start + match[0].length;
          const range = [start, end];

          context.report({
            message: "Prefer using optional chaining rather than: '{{codeFragment}}'.",
            data: {
              codeFragment: match[0]
            },
            loc: sourceCode.getLocFromIndex(range[0])
          });
        }
      }
    };
  }
};
