import utils from "eslint-plugin-vue/dist/utils/index.js";

const DEFAULT_MAX_LENGTH = 100;
const PUG_ELEMENT_HEAD_PATTERN =
  /^(?:[A-Za-z][\w-]*)?(?:[.#][A-Za-z_][\w-]*)+$/;
const CLASS_SHORTHAND_PATTERN = /\.[A-Za-z_][\w-]*/;

// Checks whether a Pug element name belongs to a Vue component
function isComponent(node) {
  return node.name.includes("-") || /^[A-Z]/.test(node.rawName);
}

export default {
  meta: {
    type: "layout",
    docs: {
      description: "enforce a maximum length for Pug class shorthand",
      category: "Stylistic Issues",
      recommended: false,
    },
    fixable: null,
    schema: [
      {
        type: "object",
        properties: {
          max: {
            type: "integer",
            minimum: 1,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      tooLong:
        "Pug class shorthand is {{length}} characters long. Move classes to a multiline :class array (maximum: {{max}}).",
    },
  },

  create(context) {
    const sourceCode = context.getSourceCode();
    const maxLength = context.options[0]?.max ?? DEFAULT_MAX_LENGTH;

    return utils.default.defineTemplateBodyVisitor(context, {
      VElement(node) {
        // Component shorthand is handled by vue-no-component-class-shorthand
        if (isComponent(node)) {
          return;
        }

        const startTagText = sourceCode.getText(node.startTag);
        const elementHead = startTagText.split(/[\s(]/, 1)[0];

        if (
          PUG_ELEMENT_HEAD_PATTERN.test(elementHead) &&
          CLASS_SHORTHAND_PATTERN.test(elementHead) &&
          elementHead.length > maxLength
        ) {
          context.report({
            node: node.startTag,
            messageId: "tooLong",
            data: {
              length: elementHead.length,
              max: maxLength,
            },
          });
        }
      },
    });
  },
};
