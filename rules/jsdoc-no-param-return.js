const FORBIDDEN_TAG_REGEX = /^\s*\*\s*@(param|arg|argument|returns?|yields?)\b/;

export default {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Forbid @param and @return tags (and their descriptions) in JSDoc, " +
        "rely on the TypeScript signature instead.",
    },
    fixable: "code",
    schema: [],
    messages: {
      noParamReturn:
        "@param and @return tags are not permitted in JSDoc, rely on the " +
        "TypeScript signature instead.",
    },
  },

  create(context) {
    const sourceCode = context.sourceCode || context.getSourceCode();

    function checkComment(comment) {
      if (comment.type !== "Block" || !comment.value.startsWith("*")) {
        return;
      }

      const lines = comment.value.split("\n");

      // Detect whether at least one forbidden tag line is present
      const hasForbidden = lines.some((line) => {
        return FORBIDDEN_TAG_REGEX.test(line);
      });

      if (!hasForbidden) {
        return;
      }

      context.report({
        node: comment,
        messageId: "noParamReturn",

        fix(fixer) {
          const kept = lines.filter((line) => {
            return !FORBIDDEN_TAG_REGEX.test(line);
          });

          return fixer.replaceText(comment, `/*${kept.join("\n")}*/`);
        },
      });
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
