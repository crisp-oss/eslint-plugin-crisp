const doctrine = require("doctrine");

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "enforce JSDoc and function parameter names match",
      category: "Possible Errors",
      recommended: true,
    },
  },

  create(context) {
    const sourceCode = context.getSourceCode();

    function getJSDocComment(node) {
      const commentsBefore = sourceCode.getCommentsBefore(node);

      const jsDocComment = commentsBefore.find(comment =>
        comment.type === 'Block' && comment.value.startsWith('*')
      );

      if (jsDocComment) {
        const parsed = doctrine.parse(jsDocComment.value, { unwrap: true });
        const jsDocParams = parsed.tags.filter(tag => tag.title === 'param').map(tag => tag.name);
        return jsDocParams;
      }

      return null;
    }

    function checkParameters(node) {
      const jsDocParams = getJSDocComment(node);

      if (!jsDocParams) {
        return;
      }

      const funcParams = node.value.params.map(param => param.type === 'Identifier' ? param.name : param.left.name);

      for (let i = 0; i < jsDocParams.length; i++) {
        if (jsDocParams[i] !== funcParams[i]) {
          context.report({
            node: node,
            message: `JSDoc @param name does not match function parameter name. Expected '${funcParams[i]}' but got '${jsDocParams[i]}'`
          });
        }
      }
    }

    return {
      FunctionDeclaration: checkParameters,
      MethodDefinition: checkParameters,
    };
  },
};
