const DIRECTIVE_REGEX = /^(eslint|ts-|@ts|prettier-|global |globals |istanbul|c8 |v8 |jshint|jslint)/;

// A short capitalized label followed by a colon (e.g. 'Notice:', 'Important:',
// 'Source:') introduces a new logical comment, so the previous comment does not
// need to be merged into a continuation block with it. The label is kept short
// (up to ~40 chars) to avoid matching a regular sentence that contains a colon
const BOUNDARY_REGEX = /^[A-Z][^:]{0,39}:/;

function getCore(comment) {
  // Strip the trailing continuation backslash and surrounding whitespace
  return comment.value.replace(/\\\s*$/, "").trim();
}

function isDirective(core) {
  return DIRECTIVE_REGEX.test(core);
}

function isBoundary(core) {
  return BOUNDARY_REGEX.test(core);
}

function isContinuationLine(comment) {
  // Continuation lines use at least three spaces after '//'
  return /^ {3,}/.test(comment.value);
}

function isBoundaryComment(comment) {
  // Labels such as 'Notice:' only split groups on first lines, not mid-block
  // prose like '//   In other words: …'
  return !isContinuationLine(comment) && isBoundary(getCore(comment));
}

function endsWithContinuation(comment) {
  return /\\\s*$/.test(comment.value);
}

function isBlankSeparatorLine(comment) {
  // A line that only contains '\' (e.g. '// \' or '//   \') is a visual separator
  return (
    comment.type === "Line" &&
    endsWithContinuation(comment) &&
    getCore(comment).length === 0
  );
}

export default {
  meta: {
    type: "layout",
    docs: {
      description:
        "Enforce that consecutive single-line comments are written as a " +
        "single multi-line continuation block.",
      category: "Stylistic Issues",
      recommended: false,
    },
    fixable: "whitespace",
    schema: [],
    messages: {
      format:
        "Consecutive single-line comments must form a continuation block: " +
        "each line ends with '\\' (except the last) and continuation lines " +
        "are indented with at least three spaces after '//'.",
    },
  },

  create(context) {
    const sourceCode = context.sourceCode || context.getSourceCode();

    function isStandalone(comment) {
      const lineText = sourceCode.lines[comment.loc.start.line - 1] || "";
      const before = lineText.slice(0, comment.loc.start.column);

      return before.trim() === "";
    }

    function getCanonicalCommentText(comment, index, groupLength) {
      const core = getCore(comment);
      const isLast = index === groupLength - 1;
      const suffix = isLast ? "" : " \\";

      if (index === 0) {
        return `// ${core}${suffix}`;
      }

      return `//   ${core}${suffix}`;
    }

    function commentMatchesCanonical(comment, index, groupLength) {
      const core = getCore(comment);
      const isLast = index === groupLength - 1;
      const line = sourceCode.lines[comment.loc.start.line - 1] || "";
      const actual = line.slice(comment.loc.start.column);

      if (isBlankSeparatorLine(comment) && index < groupLength - 1) {
        return /^\/\/\s*\\$/.test(actual);
      }

      if (index === 0) {
        const expected = `// ${core}${isLast ? "" : " \\"}`;

        return actual === expected;
      }

      const match = actual.match(/^\/\/(\s+)(.*)$/);

      if (!match || match[1].length < 3) {
        return false;
      }

      let body = match[2];

      if (!isLast) {
        if (!/\\\s*$/.test(body)) {
          return false;
        }

        body = body.replace(/\\\s*$/, "");
      }

      return body.trim() === core;
    }

    function checkGroup(group) {
      if (group.length < 2) {
        return;
      }

      const indent = " ".repeat(group[0].loc.start.column);

      const canonicalLines = group.map((comment, index) => {
        return getCanonicalCommentText(comment, index, group.length);
      });

      const canonical = canonicalLines.join(`\n${indent}`);

      const allMatch = group.every((comment, index) => {
        return commentMatchesCanonical(comment, index, group.length);
      });

      if (allMatch) {
        return;
      }

      context.report({
        loc: {
          start: group[0].loc.start,
          end: group[group.length - 1].loc.end,
        },
        messageId: "format",

        fix(fixer) {
          return fixer.replaceTextRange(
            [group[0].range[0], group[group.length - 1].range[1]],
            canonical
          );
        },
      });
    }

    return {
      Program() {
        const comments = sourceCode.getAllComments();

        let group = [];
        let skipDirectiveContinuation = false;
        let skipColumn = 0;
        let skipLine = 0;

        const flush = () => {
          checkGroup(group);

          group = [];
        };

        for (const comment of comments) {
          if (
            skipDirectiveContinuation &&
            comment.type === "Line" &&
            isStandalone(comment) &&
            comment.loc.start.line === skipLine + 1 &&
            comment.loc.start.column === skipColumn
          ) {
            skipLine = comment.loc.start.line;

            if (!endsWithContinuation(comment)) {
              skipDirectiveContinuation = false;
            }

            continue;
          }

          skipDirectiveContinuation = false;

          const core = getCore(comment);
          const isGroupable =
            comment.type === "Line" &&
            isStandalone(comment) &&
            !isDirective(core) &&
            (core.length > 0 || isBlankSeparatorLine(comment));

          if (!isGroupable) {
            flush();

            if (
              comment.type === "Line" &&
              isStandalone(comment) &&
              isDirective(core) &&
              endsWithContinuation(comment)
            ) {
              skipDirectiveContinuation = true;
              skipColumn = comment.loc.start.column;
              skipLine = comment.loc.start.line;
            }

            continue;
          }

          if (group.length > 0) {
            const previous = group[group.length - 1];
            const isConsecutive =
              comment.loc.start.line === previous.loc.start.line + 1 &&
              comment.loc.start.column === previous.loc.start.column;

            // A completed block (no trailing '\') must not absorb the next line
            if (!endsWithContinuation(previous)) {
              flush();
            }

            if (group.length > 0) {
              const last = group[group.length - 1];
              const stillConsecutive =
                comment.loc.start.line === last.loc.start.line + 1 &&
                comment.loc.start.column === last.loc.start.column;

              // A boundary marker (e.g. 'Notice:') always starts a fresh group,
              // so the previous comment is left untouched
              if (!stillConsecutive || isBoundaryComment(comment)) {
                flush();
              }
            }
          }

          group.push(comment);
        }

        flush();
      },
    };
  },
};
