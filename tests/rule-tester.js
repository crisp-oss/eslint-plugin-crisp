import { RuleTester } from "eslint";
import { describe, it } from "node:test";
import vueParser from "vue-eslint-parser";

RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;

export default function createRuleTester({
  languageOptions = {},

  ...options
} = {}) {
  return new RuleTester({
    ...options,

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",

      ...languageOptions
    }
  });
}

export function createVueRuleTester(options = {}) {
  return createRuleTester({
    ...options,

    languageOptions: {
      ...options.languageOptions,

      parser: vueParser
    }
  });
}

export function createPugRuleTester(options = {}) {
  return createVueRuleTester({
    ...options,

    languageOptions: {
      ...options.languageOptions,

      parserOptions: {
        ...options.languageOptions?.parserOptions,

        templateTokenizer: {
          pug: "vue-eslint-parser-template-tokenizer-pug"
        }
      }
    }
  });
}

export function withoutFixes(rule) {
  const { fixable, ...meta } = rule.meta || {};

  return {
    ...rule,

    meta,

    create(context) {
      const reportOnlyContext = Object.create(context);

      Object.defineProperty(reportOnlyContext, "report", {
        value(descriptor) {
          const { fix, ...report } = descriptor;

          context.report(report);
        }
      });

      return rule.create(reportOnlyContext);
    }
  };
}
