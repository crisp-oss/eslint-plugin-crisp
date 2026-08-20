const findContainingTernaryBranch = (node) => {
  let child = node;
  let parent = node.parent;

  while (parent) {
    if (
      parent.type === "ConditionalExpression" &&
      (parent.consequent === child || parent.alternate === child)
    ) {
      return parent;
    }

    child = parent;
    parent = parent.parent;
  }

  return null;
};

export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "Disallow inline functions in ternary branches."
    },
    schema: [],
    messages: {
      inlineFunction: "Extract this inline function from the ternary expression."
    }
  },

  create(context) {
    const checkFunction = (node) => {
      if (!findContainingTernaryBranch(node)) {
        return;
      }

      context.report({
        node,
        messageId: "inlineFunction"
      });
    };

    return {
      ArrowFunctionExpression: checkFunction,
      FunctionExpression: checkFunction
    };
  }
};
