import type { ESLint, Linter, Rule } from "eslint";

/**
 * Names of the flat configs shipped by the plugin
 */
export type CrispConfigName = "recommended" | "recommended-vue" | "recommended-ts";

/**
 * Names of the rules shipped by the plugin (without the `crisp/` prefix)
 */
export type CrispRuleName =
  | "align-comments"
  | "align-consecutive-class-assignements"
  | "align-one-var"
  | "align-requires"
  | "arrow-block-newline"
  | "consecutive-line-comments"
  | "const"
  | "constructor-variables"
  | "enforce-optional"
  | "header-check"
  | "header-comments-check"
  | "import-group-comment"
  | "import-group-order"
  | "jsdoc-align-params"
  | "jsdoc-check-indentation"
  | "jsdoc-check-optional-params"
  | "jsdoc-description-multiline"
  | "jsdoc-enforce-access"
  | "jsdoc-enforce-classdesc"
  | "jsdoc-no-param-return"
  | "jsdoc-require-description-uppercase"
  | "jsdoc-description-length"
  | "methods-naming"
  | "methods-ordering"
  | "multiline-comment-end-backslash"
  | "newline-after-switch-case"
  | "no-async"
  | "no-extra-line-within-function"
  | "no-inline-function-in-ternary"
  | "no-space-in-optional-arguments"
  | "no-var-in-blocks"
  | "no-useless-template-literals"
  | "no-short-parameters"
  | "no-snake-case"
  | "one-space-after-operator"
  | "regex-in-constructor"
  | "ternary-parenthesis"
  | "two-lines-between-class-members"
  | "variable-names"
  | "vue-attribute-comma"
  | "vue-attribute-linebreak"
  | "vue-computed-order"
  | "vue-data-comment"
  | "vue-define-component"
  | "vue-emits-order"
  | "vue-header-check"
  | "vue-html-indent"
  | "vue-html-quotes"
  | "vue-methods-separator"
  | "vue-name-prop"
  | "vue-no-name-option"
  | "vue-no-regex-data"
  | "vue-props-declaration-line-break"
  | "vue-props-declaration-multiline"
  | "vue-props-declaration-order"
  | "vue-ref-case";

/**
 * The `eslint-plugin-crisp` plugin object
 */
export interface CrispPlugin extends ESLint.Plugin {
  meta: {
    name: string;
    version: string;
    namespace: "crisp";
  };

  configs: Record<CrispConfigName, Linter.Config[]>;

  rules: Record<CrispRuleName, Rule.RuleModule>;
}

declare const plugin: CrispPlugin;

export default plugin;
