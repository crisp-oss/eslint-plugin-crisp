import iterateJsdoc from "eslint-plugin-jsdoc/iterateJsdoc.js";

const TAG_LINE_REGEX = /^\s*\*?\s*@([a-zA-Z]+)/;
const EMPTY_LINE_REGEX = /^\s*\*?\s*$/;

export default iterateJsdoc(({
  context,
  jsdoc,
  jsdocNode,
  sourceCode
}) => {
  const allowedTags = context.options[0]?.allowedTags || [];

  const forbiddenTags = jsdoc.tags.filter((tag) => {
    return !allowedTags.includes(tag.tag);
  });

  if (forbiddenTags.length === 0) {
    return;
  }

  const lines = sourceCode.getText(jsdocNode).split("\n");

  // Drop forbidden tag lines, along with their continuation lines
  let isDropping = false;

  const kept = lines.filter((line, index) => {
    if (index === 0 || index === lines.length - 1) {
      return true;
    }

    const match = line.match(TAG_LINE_REGEX);

    if (match) {
      isDropping = !allowedTags.includes(match[1]);
    }

    return !isDropping;
  });

  // Drop empty lines left before the closing delimiter
  while (kept.length > 2 && EMPTY_LINE_REGEX.test(kept[kept.length - 2])) {
    kept.splice(kept.length - 2, 1);
  }

  const hasDescription = kept.slice(1, -1).some((line) => {
    return !EMPTY_LINE_REGEX.test(line);
  });

  context.report({
    node: jsdocNode,
    messageId: "descriptionOnly",

    data: {
      tags: forbiddenTags.map((tag) => {
        return `@${tag.tag}`;
      }).join(", ")
    },

    // Do not fix tag-only comments, as this would leave an empty JSDoc
    fix: hasDescription ? (fixer) => {
      return fixer.replaceText(jsdocNode, kept.join("\n"));
    } : null
  });
}, {
  contextDefaults: true,

  meta: {
    type: "suggestion",
    docs: {
      description: "Forbid tags in function JSDoc, which must only hold a description."
    },
    fixable: "code",
    schema: [
      {
        type: "object",
        properties: {
          allowedTags: {
            type: "array",
            items: {
              type: "string"
            }
          },
          contexts: {
            type: "array"
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      descriptionOnly:
        "Function JSDoc must only hold a description, remove {{ tags }}."
    }
  }
});
