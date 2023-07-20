const fs = require("fs");
const path = require("path");

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce file header",
      category: "Best Practices",
      recommended: false,
    },
    fixable: null,  // This rule is not auto-fixable
  },

  create(context) {
    return {
      Program(node) {
        const fileName = context.getFilename();
        const fileContent = fs.readFileSync(path.resolve(fileName), "utf8");

        // Determine the file extension
        const fileExtension = path.extname(fileName);

        // Base header comment pattern
        let basePattern = "\n \\* This file is part of .+\\n \\*\\n \\* Copyright \\(c\\) \\d{4} Crisp IM SAS\\n \\* All rights belong to Crisp IM SAS\\n ";

        let headerStart, headerEnd;

        // Set the headerFormat RegExp according to the file type
        if (fileExtension === ".vue") {
          headerStart = "<!--";
          headerEnd = "-->";
        } else if (fileExtension === ".js") {
          headerStart = "\/\\*";
          headerEnd = "\\*\/";
        }

        // Construct the final headerFormat RegExp
        const headerFormat = headerStart && headerEnd ? new RegExp("^" + headerStart + basePattern + headerEnd) : null;

        // Only check the header format if it's a .vue or .js file
        if (headerFormat && !headerFormat.test(fileContent)) {
          context.report({
            node,
            message: "File must start with the proper header.",
          });
        }
      },
    };
  },
};
