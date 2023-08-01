module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'enforce alignment for JSDoc',
      category: 'Stylistic Issues',
      recommended: false,
    },
    fixable: 'whitespace',
  },
  create: function(context) {
    return {
      Program: function(node) {
        const comments = context.getSourceCode().getAllComments(node);

        comments
          .filter(comment => comment.type === 'Block' && comment.value.startsWith('*'))
          .forEach(jsdocComment => {
            const lines = jsdocComment.value.split('\n');
            let bracePos = -1, descPos = -1;
            let lineNum = jsdocComment.loc.start.line;

            for (const line of lines) {
              const paramMatch = line.match(/@param\s*{(\S*)}[\s\t]+(\S+)\s*(.*)/);
              const returnMatch = line.match(/@return\s*{(\S*)}\s*(.*)/);

              let match = null;

              if (paramMatch) {
                match = paramMatch;
              } else if (returnMatch) {
                match = returnMatch;
              }

              if (match) {
                const newBracePos = match.index + match[0].indexOf('{');

                // Check for multiple types, skip alignment if found
                const multipleTypes = /\|/.test(match[1]);
                if (multipleTypes) {
                  continue;
                }

                let descStart = match[0].substring(match[0].lastIndexOf('}') + 1).search(/\S/);

                // If description is undefined, skip the description alignment check
                if (match[match.length - 1] === 'undefined') {
                  descStart = -1;
                }

                if (descStart !== -1) {
                  const newDescPos = match.index + match[0].lastIndexOf('}') + 1 + descStart + 1; // +1 for ESLint column index

                  if (descPos === -1) {
                    descPos = newDescPos;
                  } else if (descPos !== newDescPos) {
                    const message = `In JSDoc at line ${lineNum}, the description is misaligned. Found at column ${newDescPos}, but expected column ${descPos}.`;

                    context.report({
                      message,
                      loc: { line: lineNum, column: newDescPos },
                    });
                  }
                }

                if (bracePos === -1) {
                  bracePos = newBracePos;
                } else if (bracePos !== newBracePos) {
                  const message = `In JSDoc at line ${lineNum}, the type brace is misaligned. Found at column ${newBracePos + 1}, but expected column ${bracePos + 1}.`;

                  context.report({
                    message,
                    loc: { line: lineNum, column: newBracePos + 1 },
                  });
                }
              }
              lineNum++;
            }
          });
      },
    };
  },
};
