import fs from "fs";
import path from "path";

export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce file header",
      category: "Best Practices",
      recommended: false,
    },
    schema: [
      {
        type: "object",
        properties: {
          patterns: {
            type: "array",
            items: { type: "string" },
          }
        },
        additionalProperties: false,
      },
    ],
    fixable: null,  // This rule is not auto-fixable
  },

  create(context) {
    return {
      Program(node) {
        const options = context.options[0] || {};
        const fileName = context.getFilename();

        let fileContent = fs.readFileSync(path.resolve(fileName), "utf8");

        fileContent = fileContent.trim();

        // Determine the file extension
        const fileExtension = path.extname(fileName);

        // Base header comment patterns
        let basePatterns = options.patterns || [
          "\n \\* This file is part of .+\\n \\*\\n \\* Copyright \\(c\\) \\d{4} Crisp IM SAS\\n \\* All rights belong to Crisp IM SAS\\n ",
          "\n \\* This file is part of .+\\n \\* .+ script\\n \\*\\n \\* Copyright \\d{4}, Crisp IM SAS\\n \\* Author: .+\\n ",
          "\n \\* Bundle: .+\\n \\* Project: .+\\n \\* Author: .+\\n \\* Copyright: \\d{4}, Crisp IM SAS\\n "
        ];

        let headerStart, headerEnd;

        // Set the headerFormat RegExp according to the file type
        if (fileExtension === ".vue") {
          headerStart = "<!--";
          headerEnd = "-->";
        } else if (fileExtension === ".js") {
          headerStart = "\/\\*";
          headerEnd = "\\*\/";
        }

        if (headerStart && headerEnd) {
          // Construct the final headerFormat RegExps
          const headerFormats = basePatterns.map(pattern => headerStart && headerEnd ? new RegExp("^" + headerStart + pattern + headerEnd) : null);

          if (headerFormats.some(format => format && format.test(fileContent)) === false) {
            context.report({
              node,
              message: "File must start with the proper header.",
            });
          }
        }
      },
    };
  },
};
