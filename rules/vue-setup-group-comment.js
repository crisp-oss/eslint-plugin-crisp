const GROUPS = {
  defineProps: "PROPS",
  withDefaults: "PROPS",
  defineModel: "MODEL",
  defineEmits: "EMITS",
  computed: "COMPUTED"
};

const GROUP_COMMENT_LIKE_PATTERN = /^[A-Z][A-Z0-9 :]*$/;

const WRAPPER_TYPES = [
  "TSAsExpression",
  "TSSatisfiesExpression",
  "TSNonNullExpression"
];

function getCallName(node) {
  while (node && WRAPPER_TYPES.includes(node.type)) {
    node = node.expression;
  }

  if (
    node?.type === "CallExpression" &&
    node.callee.type === "Identifier" &&
    Object.hasOwn(GROUPS, node.callee.name)
  ) {
    return node.callee.name;
  }

  return null;
}

function getStatementGroup(statement) {
  let callName = null;

  if (statement.type === "VariableDeclaration") {
    if (statement.declarations.length === 1) {
      callName = getCallName(statement.declarations[0].init);
    }
  } else if (statement.type === "ExpressionStatement") {
    callName = getCallName(statement.expression);
  }

  return callName ? GROUPS[callName] : null;
}

export default {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "enforce a group comment before Vue script setup props, model, " +
        "emits and computed declarations",
      category: "Stylistic Issues",
      recommended: false
    },
    fixable: "code",
    schema: [],
    messages: {
      missingGroupComment:
        "{{ group }} declarations must be preceded by a '// {{ group }}' " +
        "comment."
    }
  },

  create(context) {
    if (!context.filename.endsWith(".vue")) {
      return {};
    }

    const sourceCode = context.sourceCode;

    // Returns the line comments directly attached above the statement
    function getCommentBlock(statement) {
      const comments = sourceCode.getCommentsBefore(statement);
      const block = [];

      let nextLine = statement.loc.start.line;

      for (let i = comments.length - 1; i >= 0; i--) {
        const comment = comments[i];

        if (
          comment.type !== "Line" ||
          comment.loc.end.line !== nextLine - 1
        ) {
          break;
        }

        block.unshift(comment);

        nextLine = comment.loc.start.line;
      }

      return block;
    }

    return {
      Program(node) {
        let previousGroup = null;

        node.body.forEach((statement) => {
          const group = getStatementGroup(statement);

          if (!group || group === previousGroup) {
            previousGroup = group;

            return;
          }

          previousGroup = group;

          const block = getCommentBlock(statement);

          if (block[0]?.value.trim() === group) {
            return;
          }

          const target = block[0] || statement;
          const indent = " ".repeat(target.loc.start.column);

          context.report({
            node: statement,
            messageId: "missingGroupComment",

            data: {
              group
            },

            fix(fixer) {
              const detachedComment = sourceCode.getCommentsBefore(target).at(-1);

              // Attach a group comment separated by blank lines
              if (
                detachedComment?.type === "Line" &&
                detachedComment.value.trim() === group
              ) {
                return fixer.replaceTextRange(
                  [detachedComment.range[1], target.range[0]],
                  `\n${indent}`
                );
              }

              // Replace a misspelled group comment, or insert a new one
              if (
                block[0] &&
                GROUP_COMMENT_LIKE_PATTERN.test(block[0].value.trim())
              ) {
                return fixer.replaceText(block[0], `// ${group}`);
              }

              return fixer.insertTextBefore(target, `// ${group}\n${indent}`);
            }
          });
        });
      }
    };
  }
};
