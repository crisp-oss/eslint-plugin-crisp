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

    const patterns = [
      // Search for `foo && foo.` or `foo && foo[`
      // Notice: do not match `foo && foo.bar !==` or `foo && foo[bar] !==`, \
      //   as the version with optional chaining would be unsafe
      /\b(\w\S+)\s&&\s+\1\b[\[\.](?!\w\S+\s\!\=\=)/g,

      // Search for patterns like `foo || {}).bar`, `foo || {})[`, \
      //   `foo || []).bar` or `foo || [])[`
      // Notice: do not match if the value after the dot is "filter", "find", \
      //   "findIndex", "map", "reduce", "length <", "length === 0", or \
      //   "length == 0", as the version with optional chaining would be unsafe
      /(.+?)\s\|\|\s(\{\}|\[\])\)(\[|\.(?!some\b|filter\b|find\b|findIndex\b|reduce\b|map\b|indexOf\b|length\s*<|length\s*===\s*0|length\s*==\s*0))\w*/g
    ];

    return {
      Program() {
        const text = sourceCode.getText();

        patterns.forEach((pattern, index) => {
          let match;

          // Reset lastIndex in case the RegExp object is reused
          pattern.lastIndex = 0;

          while ((match = pattern.exec(text)) !== null) {
            const start = match.index;
            const end = start + match[0].length;

            const range = [start, end];

            if (
              index === 1 &&
                /Object\.(keys|values|entries)\(/.test(match[1])
            ) {
              // Ignore `Object.keys(foo || {})` (and others) as it cannot be \
              //   safely transformed to optional chaining
            } else {
              context.report({
                message: "Prefer using optional chaining rather than: '{{codeFragment}}'.",
                data: {
                  codeFragment: match[0]
                },
                loc: sourceCode.getLocFromIndex(range[0])
              });
            }
          }
        });
      }
    };
  }
};
