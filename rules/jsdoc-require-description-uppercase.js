// Based on https://github.com/gajus/eslint-plugin-jsdoc/blob/main/src/rules/requireDescriptionCompleteSentence.js
// Removed handling of sentences, punctuation, abbreviations. We just need to check that the description starts with an uppercase character.

import iterateJsdoc from "eslint-plugin-jsdoc/iterateJsdoc.js";
import escapeStringRegexp from "escape-string-regexp";

const otherDescriptiveTags = new Set([
  // 'copyright' and 'see' might be good addition, but as the former may be
  //   sensitive text, and the latter may have just a link, they are not
  //   included by default
  "summary", "file", "fileoverview", "overview", "classdesc", "todo",
  "deprecated", "throws", "exception", "yields", "yield",
]);

/**
 * @param {string} text
 * @returns {string[]}
 */
const extractParagraphs = (text) => {
  return text.split(/(?<![;:])\n\n+/u);
};

/**
 * @param {string} str
 * @returns {boolean}
 */
const isCapitalized = (str) => {
  return str[0] === str[0].toUpperCase();
};

/**
 * @param {string} str
 * @returns {boolean}
 */
const isTable = (str) => {
  return str.charAt(0) === "|";
};

/**
 * @param {string} str
 * @returns {string}
 */
const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * @param {string} description
 * @param {import('../iterateJsdoc.js').Report} reportOrig
 * @param {import('eslint').Rule.Node} jsdocNode
 * @param {import('eslint').SourceCode} sourceCode
 * @param {import('comment-parser').Spec|{
 *   line: import('../iterateJsdoc.js').Integer
 * }} tag
 * @returns {boolean}
 */
const validateDescription = (
  description, reportOrig, jsdocNode, sourceCode, tag,
) => {
  if (!description || (/^\n+$/u).test(description)) {
    return false;
  }

  const descriptionNoHeadings = description.replaceAll(/^\s*#[^\n]*(\n|$)/gm, "");

  const paragraphs = extractParagraphs(descriptionNoHeadings).filter(Boolean);

  return paragraphs.some((paragraph, parIdx) => {
    const sentences = [paragraph];

    const fix = /** @type {import('eslint').Rule.ReportFixer} */ (fixer) => {
      let text = sourceCode.getText(jsdocNode);

      for (const sentence of sentences.filter((sentence_) => {
        return !(/^\s*$/u).test(sentence_) && !isCapitalized(sentence_) &&
          !isTable(sentence_);
      })) {
        const beginning = sentence.split("\n")[0];

        if ("tag" in tag && tag.tag) {
          const reg = new RegExp(`(@${escapeStringRegexp(tag.tag)}.*)${escapeStringRegexp(beginning)}`, "u");

          text = text.replace(reg, (_$0, $1) => {
            return $1 + capitalize(beginning);
          });
        } else {
          text = text.replace(new RegExp("((?:[.?!]|\\*|\\})\\s*)" + escapeStringRegexp(beginning), "u"), "$1" + capitalize(beginning));
        }
      }

      return fixer.replaceText(jsdocNode, text);
    };

    /**
     * @param {string} msg
     * @param {import('eslint').Rule.ReportFixer | null | undefined} fixer
     * @param {{
     *   line?: number | undefined;
     *   column?: number | undefined;
     * } | (import('comment-parser').Spec & {
     *   line?: number | undefined;
     *   column?: number | undefined;
     * })} tagObj
     * @returns {void}
     */
    const report = (msg, fixer, tagObj) => {
      if ("line" in tagObj) {
        /**
         * @type {{
         *   line: number;
         * }}
         */ (tagObj).line += parIdx * 2;
      } else {
        /** @type {import('comment-parser').Spec} */ (
          tagObj
        ).source[0].number += parIdx * 2;
      }

      // Avoid errors if old column doesn't exist here
      tagObj.column = 0;
      reportOrig(msg, fixer, tagObj);
    };

    if (sentences.some((sentence) => {
      return !(/^\s*$/u).test(sentence) && !isCapitalized(sentence) && !isTable(sentence);
    })) {
      report("Sentences should start with an uppercase character.", fix, tag);
    }

    return false;
  });
};

export default iterateJsdoc.default(({
  sourceCode,
  context,
  jsdoc,
  report,
  jsdocNode,
  utils,
}) => {
  let {
    description,
  } = utils.getDescription();

  const indices = [
    ...description.matchAll(/```[\s\S]*```/gu),
  ].map((match) => {
    const {
      index,
    } = match;
    const [
      {
        length,
      },
    ] = match;
    return {
      index,
      length,
    };
  }).reverse();

  for (const {
    index,
    length,
  } of indices) {
    description = description.slice(0, index) +
      description.slice(/** @type {import('../iterateJsdoc.js').Integer} */ (
        index
      ) + length);
  }

  if (validateDescription(description, report, jsdocNode, sourceCode, {
    line: jsdoc.source[0].number + 1,
  })) {
    return;
  }

  utils.forEachPreferredTag("description", (matchingJsdocTag) => {
    const desc = `${matchingJsdocTag.name} ${utils.getTagDescription(matchingJsdocTag)}`.trim();
    validateDescription(desc, report, jsdocNode, sourceCode, matchingJsdocTag);
  }, true);

  const {
    tagsWithNames,
  } = utils.getTagsByType(jsdoc.tags);
  const tagsWithoutNames = utils.filterTags(({
    tag: tagName,
  }) => {
    return otherDescriptiveTags.has(tagName) ||
      utils.hasOptionTag(tagName) && !tagsWithNames.some(({
        tag,
      }) => {
        // If user accidentally adds tags with names (or like `returns`
        //  get parsed as having names), do not add to this list
        return tag === tagName;
      });
  });

  tagsWithNames.some((tag) => {
    const desc = /** @type {string} */ (
      utils.getTagDescription(tag)
    ).replace(/^- /u, "").trimEnd();

    return validateDescription(desc, report, jsdocNode, sourceCode, tag);
  });

  tagsWithoutNames.some((tag) => {
    const desc = `${tag.name} ${utils.getTagDescription(tag)}`.trim();

    return validateDescription(desc, report, jsdocNode, sourceCode, tag);
  });
}, {
  iterateAllJsdocs: true,
  meta: {
    docs: {
      description: "Requires that block description, explicit `@description`, and `@param`/`@returns` tag descriptions are written in complete sentences.",
      url: "https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/require-description-complete-sentence.md#repos-sticky-header",
    },
    fixable: "code",
    schema: [],
    type: "suggestion",
  },
});