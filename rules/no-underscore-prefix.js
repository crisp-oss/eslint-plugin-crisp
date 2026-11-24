import isVueTypeScript from "./utils/is-vue-typescript.js";

const UNDERSCORE_PREFIX_REGEX = /^_+[^_]/;

// Node CommonJS globals, re-declared in ES modules from 'import.meta.url'
const ALLOWED_NAMES = new Set(["__dirname", "__filename"]);

const CLASS_MEMBER_TYPES = [
  "MethodDefinition",
  "PropertyDefinition",
  "TSAbstractMethodDefinition",
  "TSAbstractPropertyDefinition"
];

export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "Forbid declarations whose name starts with an underscore."
    },
    schema: [{
      type: "object",
      properties: {
        onlyVueTypeScript: {
          type: "boolean"
        }
      },
      additionalProperties: false
    }],
    messages: {
      noUnderscorePrefix:
        "Declaration '{{ name }}' must not start with an underscore."
    }
  },

  create(context) {
    const options = context.options[0] || {};

    // Restrict to Vue files written in TypeScript (eg. in the Vue config)
    if (options.onlyVueTypeScript && !isVueTypeScript(context)) {
      return {};
    }

    const sourceCode = context.sourceCode;

    function report(node, name) {
      context.report({
        node: node,
        messageId: "noUnderscorePrefix",

        data: {
          name: name
        }
      });
    }

    // Check class members, which are not registered as scope variables
    function checkClassMember(node) {
      if (node.key.type === "Identifier" && !node.computed &&
            UNDERSCORE_PREFIX_REGEX.test(node.key.name)) {
        report(node.key, node.key.name);
      }
    }

    const listeners = {
      "Program:exit"() {
        // Class names are declared in both the outer and the class scope
        const reported = new Set();

        for (const scope of sourceCode.scopeManager.scopes) {
          for (const variable of scope.variables) {
            if (!UNDERSCORE_PREFIX_REGEX.test(variable.name) ||
                  ALLOWED_NAMES.has(variable.name)) {
              continue;
            }

            // Imported names are owned by their source module
            const definition = variable.defs.find((def) => {
              return def.type !== "ImportBinding";
            });

            if (definition && definition.name &&
                  !reported.has(definition.name)) {
              reported.add(definition.name);

              report(definition.name, variable.name);
            }
          }
        }
      }
    };

    for (const type of CLASS_MEMBER_TYPES) {
      listeners[type] = checkClassMember;
    }

    return listeners;
  }
};
