import iterateJsdoc from "eslint-plugin-jsdoc/iterateJsdoc.js";

export default iterateJsdoc.default(({
  context,
  indent,
  jsdocNode,
  sourceCode
}) => {
  if (jsdocNode.loc.start.line !== jsdocNode.loc.end.line) {
    return;
  }

  const description = sourceCode
    .getText(jsdocNode)
    .slice(3, -2)
    .trim();

  // Keep empty and tag-only JSDoc comments unchanged.
  if (!description || description.startsWith("@")) {
    return;
  }

  context.report({
    node: jsdocNode,
    messageId: "multiline",
    fix(fixer) {
      return fixer.replaceText(
        jsdocNode,
        `/**\n${indent} * ${description}\n${indent} */`
      );
    }
  });
}, {
  meta: {
    type: "layout",
    docs: {
      description: "Enforce multiline formatting for function JSDoc descriptions."
    },
    fixable: "whitespace",
    schema: [],
    messages: {
      multiline: "Function JSDoc descriptions must use multiline formatting."
    }
  }
});
