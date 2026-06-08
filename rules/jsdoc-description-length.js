export default {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforce JSDoc description line limits and continuation format.",
    },
    schema: [
      {
        type: "object",
        properties: {
          maxLines: {
            type: "integer",
            minimum: 1,
            default: 2,
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const maxLines = options.maxLines || 2;
    const sourceCode = context.sourceCode || context.getSourceCode();

    function checkComment(comment) {
      if (comment.type !== "Block" || !comment.value.startsWith("*")) {
        return;
      }

      // Skip section headers (lines full of asterisks)
      if (/\*{10,}/.test(comment.value)) {
        return;
      }

      const rawLines = comment.value.split("\n").slice(1);

      // Extract description lines (before any @tag)
      const descLines = [];

      for (const line of rawLines) {
        const content = line.replace(/^\s*\*\s?/, "");

        if (content.trimStart().startsWith("@")) {
          break;
        }

        if (content.trim().length > 0) {
          descLines.push({ raw: line, content: content });
        }
      }

      if (descLines.length <= 1) {
        return;
      }

      if (descLines.length > maxLines) {
        context.report({
          loc: comment.loc,
          message:
            "JSDoc description must not exceed {{ maxLines }} line(s).",
          data: { maxLines: String(maxLines) },
        });

        return;
      }

      // Multi-line is allowed, check continuation format
      for (let i = 0; i < descLines.length - 1; i++) {
        const trimmed = descLines[i].content.trimEnd();

        if (!trimmed.endsWith("\\")) {
          context.report({
            loc: comment.loc,
            message:
              "Multi-line JSDoc description must end with '\\' before " +
              "each continuation.",
          });

          return;
        }
      }

      // Check indentation on continuation lines (3 spaces after *)
      for (let i = 1; i < descLines.length; i++) {
        const match = descLines[i].raw.match(/^\s*\*( *)/);

        if (!match || match[1].length !== 3) {
          context.report({
            loc: comment.loc,
            message:
              "Continuation lines in JSDoc description must be indented " +
              "with 3 spaces after '*'.",
          });

          return;
        }
      }
    }

    return {
      "Program:exit"() {
        const comments = sourceCode.getAllComments();

        for (const comment of comments) {
          checkComment(comment);
        }
      },
    };
  },
};
