// Based on https://github.com/gajus/eslint-plugin-jsdoc/blob/main/src/rules/checkIndentation.js

import iterateJsdoc from "eslint-plugin-jsdoc/iterateJsdoc.js";

/**
 * @param {string} str
 * @param {string[]} excludeTags
 * @returns {string}
 */
const maskExcludedContent = (str, excludeTags) => {
  const regContent = new RegExp(`([ \\t]+\\*)[ \\t]@(?:${excludeTags.join("|")})(?=[ \\n])([\\w|\\W]*?\\n)(?=[ \\t]*\\*(?:[ \\t]*@\\w+\\s|\\/))`, "gu");

  return str.replace(regContent, (_match, margin, code) => {
    return (margin + "\n").repeat(code.match(/\n/gu).length);
  });
};

/**
 * @param {string} str
 * @returns {string}
 */
const maskCodeBlocks = (str) => {
  const regContent = /([ \t]+\*)[ \t]```[^\n]*?([\w|\W]*?\n)(?=[ \t]*\*(?:[ \t]*(?:```|@\w+\s)|\/))/gu;

  return str.replace(regContent, (_match, margin, code) => {
    return (margin + "\n").repeat(code.match(/\n/gu).length);
  });
};

const maskLineContinuations = (str) => {
  // Match a line ending with a backslash (first capture group) and the \
  //   line following it (second capture group)
  const regContent = /(\*\s.*\\)\n(\s*\*\s+.+)/gu;

  return str.replace(regContent, (_match, lineBeforeContinuation, lineAfterContinuation) => {
    // Normalize the line after the continuation to remove any extra spaces \
    //   after the '*'. The goal is to treat the continuation line as a \
    //   direct extension of the previous line.
    const normalizedLine = lineAfterContinuation.replace(/(\*\s)(.+)/, "$1$2");

    // Return the combined line (previous line + continuation line)
    return lineBeforeContinuation + normalizedLine;
  });
}

export default iterateJsdoc.default(({
  sourceCode,
  jsdocNode,
  report,
  context,
}) => {
  const options = context.options[0] || {};
  const /** @type {{excludeTags: string[]}} */ {
    excludeTags = [
      "example",
    ],
  } = options;

  const reg = /^(?:\/?\**|[ \t]*)\*[ \t]{2}/gmu;

  const textWithoutCodeBlocks = maskCodeBlocks(sourceCode.getText(jsdocNode));
  const textWithoutExcluded = excludeTags.length ? maskExcludedContent(textWithoutCodeBlocks, excludeTags) : textWithoutCodeBlocks;
  const text = maskLineContinuations(textWithoutExcluded);

  if (reg.test(text)) {
    const lineBreaks = text.slice(0, reg.lastIndex).match(/\n/gu) || [];
    report("There must be no indentation.", null, {
      line: lineBreaks.length,
    });
  }
}, {
  iterateAllJsdocs: true,
  meta: {
    docs: {
      description: "Reports invalid padding inside JSDoc blocks.",
      url: "https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/check-indentation.md#repos-sticky-header",
    },
    schema: [
      {
        additionalProperties: false,
        properties: {
          excludeTags: {
            items: {
              pattern: "^\\S+$",
              type: "string",
            },
            type: "array",
          },
        },
        type: "object",
      },
    ],
    type: "layout",
  },
});
