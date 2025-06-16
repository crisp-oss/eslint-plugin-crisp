import doctrine from "doctrine";

export default {
  create(context) {
    let methodOrder = []; // Keep track of method order

    return {
      MethodDefinition(node) {
        const commentsBefore = context.getSourceCode().getCommentsBefore(node);

        // Check if there is a comment matching `--> {VALUE} <--` before the node
        const nodeComment = commentsBefore.find(comment => comment.type === "Line" && /--> (.*) <--/.test(comment.value));

        // Reset methodOrder if a matching comment was found
        if (nodeComment) {
          methodOrder = [];
        }

        // Reset methodOrder if the method name is "constructor"
        if (node.kind === "constructor") {
          methodOrder = [];
        }

        // Parse JSDoc
        const jsDocComment = commentsBefore.find(comment => comment.type === "Block" && comment.value.startsWith("*"));

        // If there is no JSDoc, ignore this method
        if (!jsDocComment) {
          return;
        }

        // Parse the jsDocComment using doctrine
        const jsDoc = doctrine.parse(`/*${jsDocComment.value}*/`, { unwrap: true });

        // Extract visibility from JSDoc
        const visibilityTag = jsDoc.tags.find(tag => ["public", "protected", "private"].includes(tag.title));

        // If there is no visibility tag, ignore this method
        if (!visibilityTag) {
          return;
        }

        const methodKind = visibilityTag.title;

        // Check order of methods
        if (methodKind === "public") {
          if (methodOrder.includes("protected") || methodOrder.includes("private")) {
            context.report({
              node,
              message: "Public methods should be defined before protected or private methods."
            });
          }
          methodOrder.push("public");
        } else if (methodKind === "protected") {
          if (methodOrder.includes("private")) {
            context.report({
              node,
              message: "Protected methods should be defined before private methods."
            });
          }
          methodOrder.push("protected");
        } else if (methodKind === "private") {
          methodOrder.push("private");
        }
      }
    };
  }
};
