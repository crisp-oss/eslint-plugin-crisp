import utils from "eslint-plugin-vue/lib/utils/index.js";

export default {
  meta: {
    type: "layout",
    docs: {
      description: "enforce quotes style of HTML attributes"
    },

    schema: [
      { enum: ["double", "single"] },
      {
        type: "object",
        properties: {
          avoidEscape: {
            type: "boolean"
          }
        },
        additionalProperties: false
      }
    ],

    messages: {
      expected: "Expected to be enclosed by {{kind}}."
    }
  },

  create(context) {
    const sourceCode = context.getSourceCode()
    const double = context.options[0] !== "single"
    const avoidEscape =
      context.options[1] && context.options[1].avoidEscape === true
    const quoteChar = double ? '"' : "'"
    const quoteName = double ? "double quotes" : "single quotes"

    return utils.defineTemplateBodyVisitor(context, {
      "VAttribute[value!=null]"(node) {
        const text = sourceCode.getText(node.value)
        const firstChar = text[0]

        if (firstChar !== quoteChar) {
          const contentText = text.slice(1, -1);

          const quoted = firstChar === "'" || firstChar === '"';

          if (avoidEscape && quoted) {
            if (contentText.includes(quoteChar)) {

              return
            }
          }

          // Attribute value is an object or an array
          if (firstChar === "[" || firstChar === "{") {
            // Matching quote in the object
            if (contentText.includes(quoteChar)) {
              return
            }

            // No quotes in the object or array
            if (!contentText.includes("'") && !contentText.includes('"')) {
              return
            }
          }

          context.report({
            node: node.value,
            loc: node.value.loc,
            messageId: "expected",
            data: { kind: quoteName }
          })
        }
      }
    })
  }
}
