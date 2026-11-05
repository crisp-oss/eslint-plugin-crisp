const TAG_REGEX = /^(\s*\*\s)@(typedef|property|prop)(\s+)/;
const NAME_REGEX = /^(\s+)(\S+)/;

// Find the end index (exclusive) of a balanced "{...}" type, or -1
function findTypeEnd(line, start) {
  if (line[start] !== "{") {
    return -1;
  }

  let depth = 0;

  for (let i = start; i < line.length; i++) {
    if (line[i] === "{") {
      depth++;
    } else if (line[i] === "}") {
      depth--;

      if (depth === 0) {
        return i + 1;
      }
    }
  }

  return -1;
}

// Parse a typedef or property tag line, returns null if not a tag, false if unsupported
function parseTagLine(line) {
  const tagMatch = line.match(TAG_REGEX);

  if (!tagMatch) {
    return null;
  }

  const tag = tagMatch[2];
  const tagEnd = tagMatch[1].length + 1 + tag.length;
  const typeStart = tagMatch[0].length;
  const typeEnd = findTypeEnd(line, typeStart);

  // Multiline or malformed type, not supported
  if (typeEnd === -1) {
    return false;
  }

  const nameMatch = line.slice(typeEnd).match(NAME_REGEX);

  if (!nameMatch) {
    return false;
  }

  return {
    tag,
    tagEnd,
    typeStart,
    typeEnd,
    type: line.slice(typeStart, typeEnd),
    nameGap: nameMatch[1].length,
    nameStart: typeEnd + nameMatch[1].length
  };
}

export default {
  meta: {
    type: "layout",
    docs: {
      description: "enforce alignment of multiline @typedef definitions",
      category: "Stylistic Issues",
      recommended: false
    },
    fixable: "whitespace",
    schema: [],
    messages: {
      typedefAlignment: "@typedef must be aligned with the @property definitions",
      propertyAlignment: "@property names must be aligned in one column, one space after the longest type"
    }
  },

  create: function(context) {
    const sourceCode = context.sourceCode;

    return {
      Program: function(node) {
        const comments = sourceCode.getAllComments(node);

        comments
          .filter(comment => comment.type === "Block" && comment.value.startsWith("*"))
          .forEach(comment => {
            const lines = comment.value.split("\n");
            const entries = [];
            let offset = 0;
            let supported = true;

            // Offset of the comment value in the source code (after "/*")
            const base = comment.range[0] + 2;

            for (const line of lines) {
              const parsed = parseTagLine(line);

              if (parsed === false) {
                supported = false;
              } else if (parsed) {
                entries.push({ ...parsed, offset });
              }

              offset += line.length + 1;
            }

            const typedefs = entries.filter(entry => entry.tag === "typedef");
            const properties = entries.filter(entry => entry.tag !== "typedef");

            if (!supported || typedefs.length !== 1 || properties.length === 0) {
              return;
            }

            const tagWidth = Math.max(...entries.map(entry => entry.tag.length));

            // A typedef name is aligned with the property names when padded or already in their column
            const typedefNameAligned = typedefs[0].nameGap > 1
              || properties.every(entry => entry.nameStart === typedefs[0].nameStart);

            const typeWidth = Math.max(
              ...properties.map(entry => entry.type.length),
              ...(typedefNameAligned ? [typedefs[0].type.length] : [])
            );

            for (const entry of entries) {
              const isTypedef = entry.tag === "typedef";
              const alignName = !isTypedef || typedefNameAligned;
              const tagSpaces = " ".repeat(tagWidth - entry.tag.length + 1);

              // Typedef only aligns its type, unless its name is aligned too
              const expected = alignName
                ? tagSpaces + entry.type + " ".repeat(typeWidth - entry.type.length + 1)
                : tagSpaces;

              const start = entry.tagEnd;
              const end = alignName ? entry.nameStart : entry.typeStart;
              const current = comment.value.slice(entry.offset + start, entry.offset + end);

              if (current === expected) {
                continue;
              }

              context.report({
                loc: {
                  start: sourceCode.getLocFromIndex(base + entry.offset + start),
                  end: sourceCode.getLocFromIndex(base + entry.offset + end)
                },
                messageId: isTypedef ? "typedefAlignment" : "propertyAlignment",

                fix(fixer) {
                  return fixer.replaceTextRange(
                    [base + entry.offset + start, base + entry.offset + end],
                    expected
                  );
                }
              });
            }
          });
      }
    };
  }
};
