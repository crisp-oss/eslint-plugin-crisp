const EVENT_LISTENERS_SEPARATOR = "--> EVENT LISTENERS <--";
const EVENT_LISTENER_NAME_PATTERN = /^on[A-Z]/;
const SEPARATOR_LIKE_PATTERN = /^--> .+ <--$/;

export default {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "require on-prefixed Vue methods to be in the event listeners section",
      category: "Stylistic Issues",
      recommended: false
    },
    fixable: "code",
    schema: [],
    messages: {
      wrongSection:
        "Method '{{name}}' must be declared in the EVENT LISTENERS section."
    }
  },

  create(context) {
    const sourceCode = context.sourceCode;

    function getLineStart(node) {
      return sourceCode.getIndexFromLoc({
        line: node.loc.start.line,
        column: 0
      });
    }

    function getPropertyName(property) {
      if (property.type !== "Property" || property.computed) {
        return null;
      }

      if (property.key.type === "Identifier") {
        return property.key.name;
      }

      if (
        property.key.type === "Literal" &&
        typeof property.key.value === "string"
      ) {
        return property.key.value;
      }

      return null;
    }

    function getTopLevelComments(node, properties) {
      return sourceCode.getCommentsInside(node.value).filter((comment) => {
        return !properties.some((property) => {
          return (
            comment.range[0] >= property.range[0] &&
            comment.range[1] <= property.range[1]
          );
        });
      });
    }

    function getMethodBlock(node, property) {
      const comments = sourceCode.getCommentsBefore(property);
      const lastSeparatorIndex = comments.findLastIndex((comment) => {
        return (
          comment.type === "Line" &&
          SEPARATOR_LIKE_PATTERN.test(comment.value.trim())
        );
      });
      const ownedComments = comments.slice(lastSeparatorIndex + 1);
      const firstNode = ownedComments[0] || property;
      const start = getLineStart(firstNode);
      const linePrefix = sourceCode.text.slice(start, firstNode.range[0]);

      if (linePrefix.trim() !== "") {
        return null;
      }

      const tokenAfter = sourceCode.getTokenAfter(property);
      const comma = (
        tokenAfter?.value === "," &&
        tokenAfter.range[0] < node.value.range[1]
      )
        ? tokenAfter
        : null;
      const propertyEnd = comma?.range[1] || property.range[1];
      const remainingText = sourceCode.text.slice(
        propertyEnd,
        node.value.range[1] - 1
      );
      const nextContentMatch = remainingText.match(/\S/);
      let removalEnd = propertyEnd;

      if (nextContentMatch) {
        const nextContent = propertyEnd + nextContentMatch.index;
        const nextContentLocation = sourceCode.getLocFromIndex(nextContent);

        if (nextContentLocation.line > property.loc.end.line) {
          removalEnd = sourceCode.getIndexFromLoc({
            line: nextContentLocation.line,
            column: 0
          });
        }
      }

      return {
        start,
        end: removalEnd,
        text: sourceCode.text.slice(start, property.range[1]).trimEnd()
      };
    }

    function createMoveFix(node, properties, violations) {
      const topLevelComments = getTopLevelComments(node, properties);
      const eventSeparators = topLevelComments.filter((comment) => {
        return (
          comment.type === "Line" &&
          comment.value.trim() === EVENT_LISTENERS_SEPARATOR
        );
      });

      if (eventSeparators.length > 1) {
        return null;
      }

      const eventSeparator = eventSeparators[0] || null;
      const hasSectionAfterEvent = eventSeparator && topLevelComments.some(
        (comment) => {
          return (
            comment.range[0] > eventSeparator.range[1] &&
            comment.type === "Line" &&
            SEPARATOR_LIKE_PATTERN.test(comment.value.trim())
          );
        }
      );

      if (hasSectionAfterEvent) {
        return null;
      }

      const lastProperty = properties.at(-1);
      const trailingComments = topLevelComments.filter((comment) => {
        return comment.range[0] > lastProperty.range[1];
      });
      const hasUnsafeTrailingComment = trailingComments.some((comment) => {
        return comment !== eventSeparator;
      });

      if (hasUnsafeTrailingComment) {
        return null;
      }

      const methodBlocks = violations.map(({ property }) => {
        return getMethodBlock(node, property);
      });

      if (methodBlocks.some((block) => block === null)) {
        return null;
      }

      const movedProperties = new Set(
        violations.map(({ property }) => property)
      );
      const remainingProperties = properties.filter((property) => {
        return !movedProperties.has(property);
      });
      const interiorStart = node.value.range[0] + 1;
      const interiorEnd = node.value.range[1] - 1;
      const interiorText = sourceCode.text.slice(interiorStart, interiorEnd);
      const suffixMatch = interiorText.match(/\s*$/);
      const suffix = suffixMatch?.[0] || "";
      const edits = methodBlocks.map((block) => {
        return {
          start: block.start - interiorStart,
          end: block.end - interiorStart,
          text: ""
        };
      });

      if (remainingProperties.length > 0) {
        const lastRemainingProperty = remainingProperties.at(-1);
        const tokenAfter = sourceCode.getTokenAfter(lastRemainingProperty);
        const hasComma = (
          tokenAfter?.value === "," &&
          tokenAfter.range[0] < interiorEnd
        );

        if (!hasComma) {
          const propertyEnd = lastRemainingProperty.range[1] - interiorStart;

          edits.push({
            start: propertyEnd,
            end: propertyEnd,
            text: ","
          });
        }
      }

      const transformedText = [...edits]
        .sort((first, second) => {
          return second.start - first.start || second.end - first.end;
        })
        .reduce((text, edit) => {
          return (
            text.slice(0, edit.start) +
            edit.text +
            text.slice(edit.end)
          );
        }, interiorText)
        .trimEnd();
      const movedText = methodBlocks
        .map((block) => block.text)
        .join(",\n\n");
      const methodIndent = movedText.match(/^[\t ]*/)?.[0] || "";
      const sectionText = eventSeparator
        ? movedText
        : (
          `${methodIndent}// ${EVENT_LISTENERS_SEPARATOR}\n\n` +
          movedText
        );
      const fixedInterior = transformedText === ""
        ? `\n${sectionText}${suffix}`
        : `${transformedText}\n\n${sectionText}${suffix}`;

      return (fixer) => {
        return fixer.replaceTextRange(
          [interiorStart, interiorEnd],
          fixedInterior
        );
      };
    }

    function checkMethods(node) {
      const properties = node.value.properties;

      if (!properties) {
        return;
      }

      let eventListenersStarted = false;
      const violations = [];

      properties.forEach((property) => {
        const comments = sourceCode.getCommentsBefore(property);

        if (!eventListenersStarted) {
          eventListenersStarted = comments.some((comment) => {
            return (
              comment.type === "Line" &&
              comment.value.trim() === EVENT_LISTENERS_SEPARATOR
            );
          });
        }

        if (eventListenersStarted) {
          return;
        }

        const name = getPropertyName(property);

        if (name && EVENT_LISTENER_NAME_PATTERN.test(name)) {
          violations.push({
            property,
            name
          });
        }
      });

      const moveFix = violations.length > 0
        ? createMoveFix(node, properties, violations)
        : null;

      violations.forEach(({ property, name }, index) => {
        context.report({
          node: property.key,
          messageId: "wrongSection",
          data: { name },
          ...(index === 0 && moveFix ? { fix: moveFix } : {})
        });
      });
    }

    return {
      'ExportDefaultDeclaration > ObjectExpression > Property[key.name="methods"]':
        checkMethods,
      'ExportDefaultDeclaration > CallExpression[callee.name="defineComponent"] > ObjectExpression > Property[key.name="methods"]':
        checkMethods
    };
  }
};
