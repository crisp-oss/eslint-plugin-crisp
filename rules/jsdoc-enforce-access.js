// Pre-compiled regex for access modifier check
const ACCESS_MODIFIER_PATTERN = /@(public|protected|private|internal)(?=\s|\*|$)/;

export default {
  meta: {
    type: "problem",
    docs: {
      description: "Enforce usage of an access modifier in JSDoc",
      category: "Possible Errors",
      recommended: true,
    },
  },

  create: function(context) {
    const sourceCode = context.sourceCode || context.getSourceCode();

    function checkNodeForJSDoc(node) {
      const comments = sourceCode.getCommentsBefore(node);
      let jsdocComment = null;

      for (let i = comments.length - 1; i >= 0; i--) {
        if (
          comments[i].type === "Block" &&
          comments[i].value.startsWith("*")
        ) {
          jsdocComment = comments[i];

          break;
        }
      }

      if (jsdocComment && !ACCESS_MODIFIER_PATTERN.test(jsdocComment.value)) {
        context.report({
          node,
          message: "JSDoc comment should contain @public, @protected, @private or @internal",
        });
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
