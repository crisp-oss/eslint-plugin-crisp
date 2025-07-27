import configRecommended from "./recommended.js";
import configRecommendedVue from "./recommended-vue.js";

import ruleAlignComments from "./rules/align-comments.js";
import ruleAlignConsecutiveClassAssignements from "./rules/align-consecutive-class-assignements.js";
import ruleAlignOneVar from "./rules/align-one-var.js";
import ruleAlignRequires from "./rules/align-requires.js";
import ruleConst from "./rules/const.js";
import ruleConstructorVariables from "./rules/constructor-variables.js";
import ruleEnforceOptional from "./rules/enforce-optional.js";
import ruleHeaderCheck from "./rules/header-check.js";
import ruleHeaderCommentsCheck from "./rules/header-comments-check.js";
import ruleImportGroupComment from "./rules/import-group-comment.js";
import ruleImportGroupOrder from "./rules/import-group-order.js";
import ruleJsdocAlignParams from "./rules/jsdoc-align-params.js";
import ruleJsdocCheckIndentation from "./rules/jsdoc-check-indentation.js";
import ruleJsdocCheckOptionalParams from "./rules/jsdoc-check-optional-params.js";
import ruleJsdocEnforceAccess from "./rules/jsdoc-enforce-access.js";
import ruleJsdocEnforceClassdesc from "./rules/jsdoc-enforce-classdesc.js";
import ruleJsdocRequireDescriptionUppercase from "./rules/jsdoc-require-description-uppercase.js";
import ruleMethodsNaming from "./rules/methods-naming.js";
import ruleMethodsOrdering from "./rules/methods-ordering.js";
import ruleMultilineCommentEndBackslash from "./rules/multiline-comment-end-backslash.js";
import ruleNewlineAfterSwitchCase from "./rules/newline-after-switch-case.js";
import ruleNoAsync from "./rules/no-async.js";
import ruleNoExtraLineWithinFunction from "./rules/no-extra-line-within-function.js";
import ruleNoSpaceInOptionalArguments from "./rules/no-space-in-optional-arguments.js";
import ruleNoUselessTemplateLiterals from "./rules/no-useless-template-literals.js";
import ruleNoVarInBlocks from "./rules/no-var-in-blocks.js";
import ruleNoShortParameters from "./rules/no-short-parameters.js";
import ruleNoSnakeCase from "./rules/no-snake-case.js";
import ruleOneSpaceAfterOperator from "./rules/one-space-after-operator.js";
import ruleRegexInConstructor from "./rules/regex-in-constructor.js";
import ruleTernaryParenthesis from "./rules/ternary-parenthesis.js";
import ruleTwoLinesBetweenClassMembers from "./rules/two-lines-between-class-members.js";
import ruleVariableNames from "./rules/variable-names.js";
import ruleVueAttributeComma from "./rules/vue-attribute-comma.js";
import ruleVueAttributeLinebreak from "./rules/vue-attribute-linebreak.js";
import ruleVueComputedOrder from "./rules/vue-computed-order.js";
import ruleVueEmitsOrder from "./rules/vue-emits-order.js";
import ruleVueHeaderCheck from "./rules/vue-header-check.js";
import ruleVueHtmlIndent from "./rules/vue-html-indent.js";
import ruleVueHtmlQuotes from "./rules/vue-html-quotes.js";
import ruleVueNoRegexData from "./rules/vue-no-regex-data.js";
import ruleVuePropsDeclarationLineBreak from "./rules/vue-props-declaration-line-break.js";
import ruleVuePropsDeclarationMultiline from "./rules/vue-props-declaration-multiline.js";
import ruleVuePropsDeclarationOrder from "./rules/vue-props-declaration-order.js";
import ruleVueRefCase from "./rules/vue-ref-case.js";

import projectPackage from "./package.json" assert { type: "json" };

const plugin = {
  meta: {
    name: projectPackage.name,
    version: projectPackage.version,
    namespace: "crisp"
  },

  configs: {},

  rules: {
    "align-comments": ruleAlignComments,
    "align-consecutive-class-assignements": ruleAlignConsecutiveClassAssignements,
    "align-one-var": ruleAlignOneVar,
    "align-requires": ruleAlignRequires,
    "const": ruleConst,
    "constructor-variables": ruleConstructorVariables,
    "enforce-optional": ruleEnforceOptional,
    "header-check": ruleHeaderCheck,
    "header-comments-check": ruleHeaderCommentsCheck,
    "import-group-comment": ruleImportGroupComment,
    "import-group-order": ruleImportGroupOrder,
    "jsdoc-align-params": ruleJsdocAlignParams,
    "jsdoc-check-indentation": ruleJsdocCheckIndentation,
    "jsdoc-check-optional-params": ruleJsdocCheckOptionalParams,
    "jsdoc-enforce-access": ruleJsdocEnforceAccess,
    "jsdoc-enforce-classdesc": ruleJsdocEnforceClassdesc,
    "jsdoc-require-description-uppercase": ruleJsdocRequireDescriptionUppercase,
    "methods-naming": ruleMethodsNaming,
    "methods-ordering": ruleMethodsOrdering,
    "multiline-comment-end-backslash": ruleMultilineCommentEndBackslash,
    "newline-after-switch-case": ruleNewlineAfterSwitchCase,
    "no-async": ruleNoAsync,
    "no-extra-line-within-function": ruleNoExtraLineWithinFunction,
    "no-space-in-optional-arguments": ruleNoSpaceInOptionalArguments,
    "no-var-in-blocks": ruleNoVarInBlocks,
    "no-useless-template-literals": ruleNoUselessTemplateLiterals,
    "no-short-parameters": ruleNoShortParameters,
    "no-snake-case": ruleNoSnakeCase,
    "one-space-after-operator": ruleOneSpaceAfterOperator,
    "regex-in-constructor": ruleRegexInConstructor,
    "ternary-parenthesis": ruleTernaryParenthesis,
    "two-lines-between-class-members": ruleTwoLinesBetweenClassMembers,
    "variable-names": ruleVariableNames,
    "vue-attribute-comma": ruleVueAttributeComma,
    "vue-attribute-linebreak": ruleVueAttributeLinebreak,
    "vue-computed-order": ruleVueComputedOrder,
    "vue-emits-order": ruleVueEmitsOrder,
    "vue-header-check": ruleVueHeaderCheck,
    "vue-html-indent": ruleVueHtmlIndent,
    "vue-html-quotes": ruleVueHtmlQuotes,
    "vue-no-regex-data": ruleVueNoRegexData,
    "vue-props-declaration-line-break": ruleVuePropsDeclarationLineBreak,
    "vue-props-declaration-multiline": ruleVuePropsDeclarationMultiline,
    "vue-props-declaration-order": ruleVuePropsDeclarationOrder,
    "vue-ref-case": ruleVueRefCase
  }
};

// Assign configs here so we can reference `plugin`
Object.assign(plugin.configs, {
  recommended: configRecommended(plugin),
  "recommended-vue": configRecommendedVue(plugin)
});

export default plugin;
