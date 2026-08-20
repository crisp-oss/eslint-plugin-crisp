export default {
  meta: {
    type: "layout",
    docs: {
      description:
        "Require a newline after '{' in arrow function blocks.",
      category: "Stylistic Issues",
      recommended: false
    },
    schema: [],
    messages: {
      expectedNewline:
        "Expected a newline after '{' in arrow function block."
    }
  },

  create(context) {
    const sourceCode = context.sourceCode || context.getSourceCode();

    return {
      ArrowFunctionExpression(node) {
        if (node.body.type !== "BlockStatement") {
          return;
        }

        const block = node.body;
        const openBrace = sourceCode.getFirstToken(block);
        const closeBrace = sourceCode.getLastToken(block);
        const firstToken = sourceCode.getTokenAfter(openBrace);

        // Empty blocks such as `() => {}` are allowed
        if (!firstToken || firstToken === closeBrace) {
          return;
        }

        if (firstToken.loc.start.line !== openBrace.loc.start.line) {
          return;
        }

        context.report({
          node: openBrace,
          messageId: "expectedNewline"
        });
      }
    };
  }
};
