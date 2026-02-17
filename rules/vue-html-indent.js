import utils from "eslint-plugin-vue/dist/utils/index.js";

export default {
  meta: {
    type: "layout",
    docs: {
      description: "enforce consistent indentation in `<template>`",
      category: "Stylistic Issues",
      recommended: false,
    },
    fixable: "whitespace"
  },

  create(context) {
    const sourceCode = context.getSourceCode()
    const template = (
      sourceCode.parserServices.getTemplateBodyTokenStore &&
      sourceCode.parserServices.getTemplateBodyTokenStore()
    );

    function report(element, type, expected, actual) {
      const reportObj = {
        node: element,
        message: `Expected ${type} indentation of ${expected} spaces but found ${actual}`
      };

      if (type === "attribute") {
        reportObj.fix = function(fixer) {
          const startToken = template.getTokenBefore(element);
          const endToken = template.getTokenAfter(element);
          const indent = " ".repeat(expected);

          return fixer.replaceTextRange(
            [startToken.range[1], element.range[0]],
            `\n${indent}`
          );
        };
      }

      context.report(reportObj);
    }

    return utils.default.defineTemplateBodyVisitor(context, {
      VStartTag(node) {
        // Skip "template" tags
        if (node.parent.name === "template") {
          return;
        }

        // Odd number of spaces?
        if (node.loc.start.column % 2 !== 0) {
          report(
            node,
            "element",

            `${node.loc.start.column - 1} or ${node.loc.start.column + 1}`,
            node.loc.start.column
          );

          // Abort here as the whole element is not indented correctly
          return;
        }

        // Skip singleline element (no indentation to check)
        if (node.loc.start.line === node.loc.end.line) {
          return;
        }

        // There is a shift of 1 space on the closing tag (likely caused by Pug)
        const actual = node.loc.end.column - 1;
        const expected = node.loc.start.column;

        // Check closing tag indentation
        if (actual !== expected) {
          report(
            node,
            "closing tag",

            expected,
            actual
          );
        }

        node.attributes.forEach((attribute) => {
          const actual = attribute.loc.start.column;
          const expected = node.loc.start.column + 2;

          // Check attribute indentation
          if (actual !== expected) {
            report(
              attribute,
              "attribute",

              expected,
              actual
            );
          }
        });
      }
    })
  }
};