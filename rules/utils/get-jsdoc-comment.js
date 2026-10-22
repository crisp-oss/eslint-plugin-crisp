function findJSDocComment(sourceCode, node) {
  const comments = sourceCode.getCommentsBefore(node);
  const comment = comments.at(-1);

  if (
    !comment ||
    comment.type !== "Block" ||
    !comment.value.startsWith("*") ||
    node.loc.start.line - comment.loc.end.line > 1
  ) {
    return null;
  }

  const tokenBefore = sourceCode.getTokenBefore(node, {
    includeComments: true
  });

  return tokenBefore === comment ? comment : null;
}

export default function getJSDocComment(sourceCode, node) {
  let parent = node.parent;

  switch (node.type) {
    case "ClassDeclaration":
    case "FunctionDeclaration":
      if (
        parent?.type === "ExportDefaultDeclaration" ||
        parent?.type === "ExportNamedDeclaration"
      ) {
        return findJSDocComment(sourceCode, parent);
      }

      return findJSDocComment(sourceCode, node);

    case "ClassExpression":
      return findJSDocComment(sourceCode, parent.parent);

    case "ArrowFunctionExpression":
    case "FunctionExpression":
      if (
        parent.type !== "CallExpression" &&
        parent.type !== "NewExpression"
      ) {
        while (
          !sourceCode.getCommentsBefore(parent).length &&
          !/Function/u.test(parent.type) &&
          parent.type !== "MethodDefinition" &&
          parent.type !== "Property"
        ) {
          parent = parent.parent;

          if (!parent) {
            break;
          }
        }

        if (
          parent &&
          parent.type !== "FunctionDeclaration" &&
          parent.type !== "Program"
        ) {
          return findJSDocComment(sourceCode, parent);
        }
      }

      return findJSDocComment(sourceCode, node);

    default:
      return null;
  }
}
