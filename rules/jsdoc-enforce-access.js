// Pre-compiled regex for access modifier check
const ACCESS_MODIFIER_PATTERN = /@(public|protected|private)/;

export default {
  meta: {
    type: "problem",
    docs: {
      description: "Enforce usage of @public, @private, or @protected in JSDoc",
      category: "Possible Errors",
      recommended: true,
    },
  },

  create: function(context) {
    const sourceCode = context.sourceCode || context.getSourceCode();

    function checkNodeForJSDoc(node) {
      const comments = sourceCode.getCommentsBefore(node);

      if (comments.length > 0) {
        const lastComment = comments[comments.length - 1];

        if (lastComment.type === "Block" && lastComment.value.startsWith("*")) {
          if (!ACCESS_MODIFIER_PATTERN.test(lastComment.value)) {
            context.report({
              node,
              message: "JSDoc comment should contain @public, @protected or @private",
            });
          }
        }
      }
    }

    return {
      // For each property in an object, if it's a function / arrow function, \
      //   check its body (usefull for Vue.js components, in which methods and \
      //   computed are defined as properties of a parent object)
      Property(node) {
        if (node.value.type === "FunctionExpression" ||
        node.value.type === "ArrowFunctionExpression") {
          checkNodeForJSDoc(node);
        }
      },

      MethodDefinition(node) {
        checkNodeForJSDoc(node);
      },

      FunctionDeclaration(node) {
        checkNodeForJSDoc(node);
      },

      FunctionExpression(node) {
        checkNodeForJSDoc(node);
      },
    };
  }
};
