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
    function checkNodeForJSDoc(node, context) {
      const comments = context.getSourceCode().getCommentsBefore(node);

      if (comments.length > 0) {
        const lastComment = comments[comments.length - 1];

        if (lastComment.type === "Block" && lastComment.value.startsWith("*")) {
          if (!/@(public|protected|private)/.test(lastComment.value)) {
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
          checkNodeForJSDoc(node, context);
        }
      },

      MethodDefinition(node) {
        checkNodeForJSDoc(node, context);
      },

      FunctionDeclaration(node) {
        checkNodeForJSDoc(node, context);
      },

      FunctionExpression(node) {
        checkNodeForJSDoc(node, context);
      },
    };
  }
};
