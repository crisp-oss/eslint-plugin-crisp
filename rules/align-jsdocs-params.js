module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'enforce alignment for JSDocs',
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
              lineNum++;
              const paramMatch = line.match(/@param\s*{(\S*)}\s+(\S+)\s*(.*)/);
              const returnMatch = line.match(/@return\s*{(\S*)}\s*(.*)/);

              let match = null;

              if (paramMatch) {
                match = paramMatch;
              } else if (returnMatch) {
                match = returnMatch;
              }

              if (match) {
                const newBracePos = match.index + match[0].indexOf('{');
                let descStart = match[match.length - 1].search(/\S/);
                
                // If description is undefined, skip the description alignment check
                if (match[match.length - 1] === 'undefined') {
                  descStart = -1;
                }

                if (descStart !== -1) {
                  const newDescPos = match.index + match[0].lastIndexOf('}') + 1 + descStart + 1; // +1 for ESLint column index

                  if (descPos === -1) {
                    descPos = newDescPos;
                  } else if (descPos !== newDescPos) {
                    context.report({
                      node: jsdocComment,
                      message: `In JSDoc at line ${lineNum}, the description is misaligned. Found at column ${newDescPos}, but expected column ${descPos}.`,
                      loc: {
                        start: { line: lineNum, column: newDescPos },
                      },
                    });
                  }
                }

                if (bracePos === -1) {
                  bracePos = newBracePos;
                } else if (bracePos !== newBracePos) {
                  context.report({
                    node: jsdocComment,
                    message: `In JSDoc at line ${lineNum}, the type brace is misaligned. Found at column ${newBracePos + 1}, but expected column ${bracePos + 1}.`,
                    loc: {
                      start: { line: lineNum, column: newBracePos + 1 },
                    },
                  });
                }
              }
            }
          });
      },
    };
  },
};
