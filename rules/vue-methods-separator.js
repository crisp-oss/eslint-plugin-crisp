const SEPARATORS = [
  "--> ACTIONS <--",
  "--> HELPERS <--",
  "--> EVENT LISTENERS <--"
];

const SEPARATOR_ORDER = new Map(
  SEPARATORS.map((separator, index) => [separator, index])
);
const SEPARATOR_LIKE_PATTERN = /^--> .+ <--$/;

export default {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "enforce separator comments and their order in Vue methods block",
      category: "Stylistic Issues",
      recommended: false
    },
    fixable: "code",
    schema: [],
    messages: {
      duplicateSeparator:
        "Duplicate methods separator comment '// {{separator}}'.",
      invalidSeparator:
        "Invalid separator comment. Must be '// --> ACTIONS <--', " +
        "'// --> HELPERS <--', or '// --> EVENT LISTENERS <--'.",
      missingSeparator:
        "Methods block must contain at least one separator comment: " +
        "'// --> ACTIONS <--', '// --> HELPERS <--', " +
        "or '// --> EVENT LISTENERS <--'.",
      unorderedSeparator:
        "Methods separator comments must be ordered: '// --> ACTIONS <--', " +
        "then '// --> HELPERS <--', then '// --> EVENT LISTENERS <--'."
    }
  },

  create(context) {
    const sourceCode = context.sourceCode;

    function createOrderFix(node, separatorEntries, properties) {
      const objectEnd = node.value.range[1] - 1;
      const sectionStarts = separatorEntries.map(({ comment }) => {
        return sourceCode.getIndexFromLoc({
          line: comment.loc.start.line,
          column: 0
        });
      });

      const hasInlineSeparator = separatorEntries.some(
        ({ comment }, index) => {
          return sourceCode.text
            .slice(sectionStarts[index], comment.range[0])
            .trim() !== "";
        }
      );

      if (hasInlineSeparator) {
        return null;
      }

      const sections = separatorEntries.map((entry, index) => {
        const start = sectionStarts[index];
        const end = sectionStarts[index + 1] ?? objectEnd;
        const rawText = sourceCode.text.slice(start, end);
        const text = rawText.trimEnd();
        const nextEntry = separatorEntries[index + 1];
        const sectionProperties = properties.filter((property) => {
          return (
            property.range[0] > entry.comment.range[1] &&
            (!nextEntry || property.range[0] < nextEntry.comment.range[0])
          );
        });

        return {
          ...entry,
          start,
          end,
          text,
          trailingWhitespace: rawText.slice(text.length),
          properties: sectionProperties
        };
      });

      if (sections.some((section) => section.properties.length === 0)) {
        return null;
      }

      const sectionGap = sections[0].trailingWhitespace;

      if (!/[\r\n]/.test(sectionGap)) {
        return null;
      }

      const suffix = sections.at(-1).trailingWhitespace;
      const lastProperty = properties.at(-1);
      const tokenAfterLastProperty = sourceCode.getTokenAfter(lastProperty);
      const preserveTrailingComma = (
        tokenAfterLastProperty?.value === "," &&
        tokenAfterLastProperty.range[0] < objectEnd
      );
      const orderedSections = [...sections].sort((first, second) => {
        return first.order - second.order;
      });

      const fixedSections = orderedSections.map((section, index) => {
        const lastSectionProperty = section.properties.at(-1);
        const tokenAfterProperty = sourceCode.getTokenAfter(
          lastSectionProperty
        );
        const hasComma = (
          tokenAfterProperty?.value === "," &&
          tokenAfterProperty.range[0] < section.end
        );
        const needsComma = (
          index < orderedSections.length - 1 ||
          preserveTrailingComma
        );
        const propertyEnd = lastSectionProperty.range[1] - section.start;

        if (needsComma && !hasComma) {
          return (
            section.text.slice(0, propertyEnd) +
            "," +
            section.text.slice(propertyEnd)
          );
        }

        if (!needsComma && hasComma) {
          const commaStart = tokenAfterProperty.range[0] - section.start;

          return (
            section.text.slice(0, commaStart) +
            section.text.slice(commaStart + 1)
          );
        }

        return section.text;
      });

      return (fixer) => {
        return fixer.replaceTextRange(
          [sectionStarts[0], objectEnd],
          fixedSections.join(sectionGap) + suffix
        );
      };
    }

    function checkMethods(node) {
      const properties = node.value.properties;

      if (!properties || properties.length === 0) {
        return;
      }

      const comments = sourceCode.getCommentsInside(node.value).filter(
        (comment) => {
          return !properties.some((property) => {
            return (
              comment.range[0] >= property.range[0] &&
              comment.range[1] <= property.range[1]
            );
          });
        }
      );
      const seenSeparators = new Set();
      const separatorEntries = [];
      let separatorCount = 0;
      let hasDuplicateSeparator = false;
      let hasInvalidSeparator = false;

      comments.forEach((comment) => {
        if (comment.type !== "Line") {
          return;
        }

        const separator = comment.value.trim();
        const separatorOrder = SEPARATOR_ORDER.get(separator);

        if (separatorOrder === undefined) {
          if (SEPARATOR_LIKE_PATTERN.test(separator)) {
            hasInvalidSeparator = true;

            context.report({
              node: comment,
              messageId: "invalidSeparator"
            });
          }

          return;
        }

        separatorCount++;

        if (seenSeparators.has(separator)) {
          hasDuplicateSeparator = true;

          context.report({
            node: comment,
            messageId: "duplicateSeparator",
            data: { separator }
          });

          return;
        }

        seenSeparators.add(separator);
        separatorEntries.push({
          comment,
          order: separatorOrder
        });
      });

      let lastSeparatorOrder = -1;
      const unorderedEntries = separatorEntries.filter((entry) => {
        if (entry.order < lastSeparatorOrder) {
          return true;
        }

        lastSeparatorOrder = entry.order;

        return false;
      });

      const orderFix = (
        unorderedEntries.length > 0 &&
        !hasDuplicateSeparator &&
        !hasInvalidSeparator
      )
        ? createOrderFix(node, separatorEntries, properties)
        : null;

      unorderedEntries.forEach((entry, index) => {
        context.report({
          node: entry.comment,
          messageId: "unorderedSeparator",
          ...(index === 0 && orderFix ? { fix: orderFix } : {})
        });
      });

      if (separatorCount === 0) {
        context.report({
          node,
          messageId: "missingSeparator"
        });
      }
    }

    return {
      'ExportDefaultDeclaration > ObjectExpression > Property[key.name="methods"]':
        checkMethods,
      'ExportDefaultDeclaration > CallExpression[callee.name="defineComponent"] > ObjectExpression > Property[key.name="methods"]':
        checkMethods
    };
  }
};
