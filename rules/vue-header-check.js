const fs = require("fs");
const path = require("path");

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce Vue section headers",
      category: "Best Practices",
      recommended: false,
    },
    fixable: null  // This rule is not auto-fixable
  },

  create(context) {
    return {
      Program(node) {
        const fileName = context.getFilename();
        const fileContent = fs.readFileSync(path.resolve(fileName), "utf8");

        // Determine the file extension
        const fileExtension = path.extname(fileName);

        if (fileExtension === ".vue") {
          // Define the headers
          const headers = ["TEMPLATE", "SCRIPT", "STYLE"];

          // Define the Vue tags
          const vueTags = ["template", "script", "style"];

          // Check each tag individually
          vueTags.forEach((tag, index) => {
            const tagRegExp = new RegExp(`<${tag}`);
            const headerRegExp = new RegExp(`\\n\\n<!--\\s*\\*{70,73}\\s*\\n\\s{5}${headers[index]}\\s*\\n\\s*\\*{70,73}\\s*-->\\s*\\n\\n<${tag}`);

            // If the tag exists without the corresponding header, report an error
            if (tagRegExp.test(fileContent) && !headerRegExp.test(fileContent)) {
              context.report({
                node,
                message: `The '<${tag}>' section must be preceded by the '${headers[index]}' header comment.`,
              });
            }
          });
        }
      }
    };
  }
};
