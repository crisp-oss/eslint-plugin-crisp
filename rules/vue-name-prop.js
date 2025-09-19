import utils from "eslint-plugin-vue/lib/utils/index.js";

export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "enforce form component name prop to be lowercase and snake_case",
      category: "Stylistic Issues",
      recommended: false,
    },
    fixable: "code",
    schema: [], // no options
    messages: {
      invalidFormName: "Form component name prop \"{{nameValue}}\" should be lowercase and snake_case.",
    }
  },

  create(context) {
    return utils.defineTemplateBodyVisitor(context, {
      "VElement"(node) {
        if (node.name && node.name.startsWith("field-")) {
          const nameAttribute = node.startTag.attributes.find((attribute) => {
            return attribute.key && attribute.key.name === "name";
          });

          if (nameAttribute && nameAttribute.value) {
            if (nameAttribute.value.type !== "VLiteral") {
              return;
            }

            let nameValue = nameAttribute.value.value;

            if (nameValue && typeof nameValue === "string") {
              // Check if the name is lowercase and snake_case
              const isValidFormat = /^[a-z]+(_[a-z]+)*$/.test(nameValue);

              if (!isValidFormat) {
                context.report({
                  node: nameAttribute,
                  messageId: "invalidFormName",
                  data: {
                    nameValue,
                  },

                  fix(fixer) {
                    // Convert to snake_case
                    const fixedName = nameValue
                      .toLowerCase()
                      .replace(/[\s-]+/g, "_")
                      .replace(/[^a-z0-9_]/g, "_")
                      .replace(/_+/g, "_")
                      .replace(/^_|_$/g, "");

                    return fixer.replaceText(nameAttribute.value, `"${fixedName}"`);
                  },
                });
              }
            }
          }
        }
      }
    });
  }
};
