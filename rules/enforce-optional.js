// Pre-compiled patterns for exclusion checks (avoid creating regex in loop)
const OBJECT_METHODS_PATTERN = /Object\.(keys|values|entries)\(/;
const ARRAY_METHODS_PATTERN = /Array\.(from)\(/;
const COMPARISON_OPERATORS = new Set([
  "==",
  "!=",
  "===",
  "!==",
  "<",
  "<=",
  ">",
  ">="
]);

function findGuardedMemberExpression(node, guardText, sourceCode) {
  let currentNode = node;

  while (currentNode) {
    if (currentNode.type === "ChainExpression") {
      currentNode = currentNode.expression;
    } else if (currentNode.type === "CallExpression") {
      currentNode = currentNode.callee;
    } else if (currentNode.type === "BinaryExpression") {
      currentNode = currentNode.left;
    } else if (currentNode.type === "MemberExpression") {
      if (sourceCode.getText(currentNode.object) === guardText) {
        return currentNode;
      }

      currentNode = currentNode.object;
    } else {
      return null;
    }
  }

  return null;
}

export default {
  meta: {
    type: "problem",
    docs: {
      description: "Enforce the use of optional chaining",
      category: "Possible Errors",
      recommended: false,
    },
    schema: [], // no options
  },

  create(context) {
    const sourceCode = context.sourceCode;

    // Search for patterns like `foo || {}).bar`, `foo || {})[`, \
    //   `foo || []).bar` or `foo || [])[`
    // Notice: do not match if the value after the dot is "filter", "find", \
    //   "findIndex", "map", "reduce", "length <", "length === 0", or \
    //   "length == 0", as the version with optional chaining would be unsafe
    const fallbackPattern = /(.+?)\s\|\|\s(\{\}|\[\])\)(\[|\.(?!some\b|filter\b|find\b|findIndex\b|reduce\b|map\b|indexOf\b|length\s*<|length\s*===\s*0|length\s*==\s*0))\w*/g;

    return {
      LogicalExpression(node) {
        if (
          node.operator !== "&&" ||
          (node.right.type === "BinaryExpression" &&
          COMPARISON_OPERATORS.has(node.right.operator))
        ) {
          return;
        }

        const guardText = sourceCode.getText(node.left);
        const memberExpression = findGuardedMemberExpression(
          node.right,
          guardText,
          sourceCode
        );

        if (memberExpression) {
          const accessor = memberExpression.computed ? "[" : ".";

          context.report({
            node,
            message: "Prefer using optional chaining rather than: '{{codeFragment}}'.",
            data: {
              codeFragment: `${guardText} && ${guardText}${accessor}`
            }
          });
        }
      },

      Program() {
        const text = sourceCode.getText();
        let match;

        // Reset lastIndex in case the RegExp object is reused
        fallbackPattern.lastIndex = 0;

        while ((match = fallbackPattern.exec(text)) !== null) {
          if (
            OBJECT_METHODS_PATTERN.test(match[1]) ||
            ARRAY_METHODS_PATTERN.test(match[1])
          ) {
            // Ignore `Object.keys(foo || {})` (and others) as it cannot be \
            //   safely transformed to optional chaining
          } else {
            context.report({
              message: "Prefer using optional chaining rather than: '{{codeFragment}}'.",
              data: {
                codeFragment: match[0]
              },
              loc: sourceCode.getLocFromIndex(match.index)
            });
          }
        }
      }
    };
  }
};
