
# ESLint Plugin Crisp

[![Build and Release](https://github.com/crisp-oss/eslint-plugin-crisp/workflows/Build%20and%20Release/badge.svg)](https://github.com/crisp-oss/eslint-plugin-crisp/actions?query=workflow%3A%22Build+and+Release%22) [![NPM](https://img.shields.io/npm/v/eslint-plugin-crisp.svg)](https://www.npmjs.com/package/eslint-plugin-crisp) [![Downloads](https://img.shields.io/npm/dt/eslint-plugin-crisp.svg)](https://www.npmjs.com/package/eslint-plugin-crisp)

A set of custom [ESLint](https://eslint.org/) configurations and rules for Crisp.

**😘 Maintainers**: [@baptistejamin](https://github.com/baptistejamin), [@eliottvincent](https://github.com/eliottvincent)

## Usage

The plugin provides two configurations:
* `crisp/recommended`: JS rules targetting backend code (Node.js)
* `crisp/recommended-vue`: JS rules targetting frontend code (Vue.js)

Add the plugin in your ESLint config object, then extend the desired configuration:
```javascript
{
  "plugins": [
    "eslint-plugin-crisp"
  ],

  "extends": [
    "plugin:crisp/recommended"
    // OR "plugin:crisp/recommended-vue"
  ]
}
```

## Documentation

This is the list of plugins and rules used by ESLint Plugin Crisp, and what they do.

Each item has emojis denoting:
* ⚪️: enabled in `plugin:crisp/recommended`
* 🟢: enabled in `plugin:crisp/recommended-vue`

### Configurations
- [eslint:recommended](https://github.com/eslint/eslint) (🟢): Core ESLint rules
- [plugin:jsdoc/recommended](https://github.com/gajus/eslint-plugin-jsdoc) (⚪️🟢): JSDoc linting rules
- [plugin:vue/vue3-recommended](https://github.com/vuejs/eslint-plugin-vue) (🟢): Vue.js 3 linting rules
- [plugin:vue-pug/vue3-recommended](https://github.com/gajus/eslint-plugin-jsdoc) (🟢): Pug templates support for Vue.js linting rules

### Plugins
- [eslint-plugin-jsdoc](https://github.com/gajus/eslint-plugin-jsdoc) (⚪️🟢): JSDoc linting rules for ESLint

### Rules

#### General JS rules
- [arrow-parens](https://eslint.org/docs/latest/rules/arrow-parens) (⚪️🟢): Requires parentheses around arrow function arguments
- [brace-style](https://eslint.org/docs/latest/rules/brace-style) (⚪️🟢): Enforces one true brace style for blocks
- [comma-dangle](https://eslint.org/docs/latest/rules/comma-dangle) (⚪️🟢): Disallows trailing commas
- [comma-style](https://eslint.org/docs/latest/rules/comma-style) (⚪️🟢): Requires a comma after and on the same line
- [curly](https://eslint.org/docs/latest/rules/curly) (⚪️🟢): Ensures block statements are always wrapped in curly braces
- [computed-property-spacing](https://eslint.org/docs/latest/rules/computed-property-spacing) (🟢): Disallows spaces inside computed property brackets
- [default-param-last](https://eslint.org/docs/latest/rules/default-param-last) (⚪️🟢): Enforces default parameters to be last
- [default-case-last](https://eslint.org/docs/latest/rules/default-case-last) (⚪️🟢): Enforces default clauses in switch statements to be last
- [dot-notation](https://eslint.org/docs/latest/rules/dot-notation) (⚪️🟢): Enforces dot notation instead of square-bracket notation
- [eqeqeq](https://eslint.org/docs/latest/rules/eqeqeq) (⚪️🟢): Requires the use of `===` and `!==`
- [eol-last](https://eslint.org/docs/latest/rules/eol-last) (⚪️🟢): Requires newline at the end of files
- [indent](https://eslint.org/docs/latest/rules/indent) (⚪️🟢): Enforces 2-space indentation, and specific indentation levels for some nodes
- [for-direction](https://eslint.org/docs/latest/rules/for-direction) (⚪️🟢): Prevents for-loops to have stop condition that can never be reached
- [key-spacing](https://eslint.org/docs/latest/rules/key-spacing) (🟢): Enforces consistent spacing in object literal properties (no space between the key and the colon, one space between the colon and the value)
- [linebreak-style](https://eslint.org/docs/latest/rules/linebreak-style) (⚪️🟢): Enforces Unix-style line endings
- [max-len](https://eslint.org/docs/latest/rules/max-len) (⚪️): Enforces a maximum line length of 80 characters
- [newline-per-chained-call](https://eslint.org/docs/latest/rules/newline-per-chained-call) (🟢): Requires a newline after each call in a method chain
- [no-console](https://eslint.org/docs/latest/rules/no-console) (⚪️🟢): Disallows the use of `console`
- [no-debugger](https://eslint.org/docs/latest/rules/no-debugger) (⚪️🟢): Disallows the use of `debugger`
- [no-eval](https://eslint.org/docs/latest/rules/no-eval) (⚪️🟢): Disallows the use of `eval`
- [no-magic-numbers](https://eslint.org/docs/latest/rules/no-magic-numbers) (⚪️): Disallows magic numbers (except the ones in the context of array indexes and in default value assignments)
- [no-multi-str](https://eslint.org/docs/latest/rules/no-multi-str) (⚪️🟢): Disallows multiline strings
- [no-multiple-empty-lines](https://eslint.org/docs/latest/rules/no-multiple-empty-lines) (🟢): Allows a maximum of 1 consecutive empty lines
- [no-mixed-spaces-and-tabs](https://eslint.org/docs/latest/rules/no-mixed-spaces-and-tabs) (⚪️🟢): Disallows mixed spaces and tabs for indentation
- [no-restricted-syntax](https://eslint.org/docs/latest/rules/no-restricted-syntax) (🟢): Enforces `switch` `case`'s content to be enclosed in braces
- [no-tabs](https://eslint.org/docs/latest/rules/no-tabs) (⚪️🟢): Disallows tabs
- [no-trailing-spaces](https://eslint.org/docs/latest/rules/no-trailing-spaces) (⚪️🟢): Disallows trailing whitespace at the end of lines
- [no-unused-vars](https://eslint.org/docs/latest/rules/no-unused-vars) (⚪️🟢): Disallows unused variables
- [no-unsafe-optional-chaining](https://eslint.org/docs/latest/rules/no-unsafe-optional-chaining) (⚪️🟢): Disallows use of optional chaining in contexts where the `undefined` value is not allowed
- [object-curly-newline](https://eslint.org/docs/latest/rules/object-curly-newline) (⚪️🟢): Requires line breaks after opening and before closing braces
- [object-curly-spacing](https://eslint.org/docs/latest/rules/object-curly-spacing) (⚪️🟢): Requires spacing inside of braces
- [padded-blocks](https://eslint.org/docs/latest/rules/padded-blocks) (⚪️🟢): Disallows empty lines at the beginning and ending of blocks
- [padding-line-between-statements](https://eslint.org/docs/latest/rules/padding-line-between-statements) (⚪️🟢): Requires padding lines between various statements
- [prefer-arrow-callback](https://eslint.org/docs/latest/rules/prefer-arrow-callback) (🟢): Requires using arrow functions for callbacks
- [quotes](https://eslint.org/docs/latest/rules/quotes) (⚪️🟢): Enforces the consistent use of double quotes (while allowing single quotes in order to avoid escape, and backticks for template literals)
- [quote-props](https://eslint.org/docs/latest/rules/quote-props) (⚪️🟢): Disallows quotes around object literal property names that are not strictly required
- [semi](https://eslint.org/docs/latest/rules/semi) (⚪️🟢): Requires semicolons at the end of statements
- [semi-style](https://eslint.org/docs/latest/rules/semi-style) (⚪️🟢): Enforces that semicolons are at the end of statements
- [semi-spacing](https://eslint.org/docs/latest/rules/semi-spacing) (🟢): Disallows space before semicolons, enforces spaces after
- [space-before-blocks](https://eslint.org/docs/latest/rules/space-before-blocks) (⚪️🟢): Enforces consistent spacing before blocks
- [space-in-parens](https://eslint.org/docs/latest/rules/space-in-parens) (⚪️🟢): Enforces zero spaces inside of parentheses

#### Crisp JS rules
- [crisp/align-consecutive-class-assignements](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/align-consecutive-class-assignements.js) (⚪️): Enforces alignment of consecutive assignment statements in a class constructor
- [crisp/align-one-var](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/align-one-var.js) (⚪️): Enforces alignment of variables in 'one-var' statements
- [crisp/align-requires](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/align-requires.js) (⚪️): Enforces alignment of require statements
- [crisp/const](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/const.js) (⚪️): Enforces that `const` variables start with `__` or are all uppercase
- [crisp/constructor-variables](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/constructor-variables.js) (⚪️): Ensures all class properties in the constructor start with `_`
- [crisp/enforce-optional](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/enforce-optional.js) (⚪️🟢): Enforces use of optional chaining
- [crisp/header-check](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/header-check.js) (⚪️🟢): Enforces files to start with Crisp header
- [crisp/header-comments-check](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/header-comments-check.js) (⚪️🟢):
- [crisp/methods-naming](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/methods-naming.js) (⚪️🟢): Enforces different comment blocks before different groups (imports, exports, constants and instances)
- [crisp/methods-ordering](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/methods-ordering.js) (⚪️🟢): Ensures methods order according to their access: `public` then `protected` then `private`
- [crisp/multiline-comment-end-backslash](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/multiline-comment-end-backslash.js) (⚪️🟢): Enforces multiline comments to end with a backslash
- [crisp/newline-after-switch-case](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/newline-after-switch-case.js) (⚪️🟢): Requires newline between switch cases
- [crisp/no-async](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/no-async.js) (⚪️🟢): Disallows the use of `async/syntax`, in favor of `Promise`
- [crisp/no-short-parameters](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/no-short-parameters.js) (⚪️🟢): Disallow parameter names shorter than 3 characters
- [crisp/no-space-in-optional-arguments](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/no-space-in-optional-arguments.js) (⚪️): Disallows space before or after `=` in optional parameters
- [crisp/no-useless-template-literals](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/no-useless-template-literals.js) (🟢): Disallows unnecessary use of template literals
- [crisp/no-var-in-blocks](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/no-var-in-blocks.js) (⚪️🟢): Disallows `var` declarations inside function, method, or class block
- [crisp/one-space-after-operator](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/one-space-after-operator.js) (⚪️🟢): Enforces at least one space before and one space after `=` and `:` operators
- [crisp/regex-in-constructor](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/regex-in-constructor.js) (⚪️🟢): Ensures regular expressions are defined in the class constructor
- [crisp/ternary-parenthesis](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/ternary-parenthesis.js) (⚪️🟢): Enforces parentheses around conditions with operators in ternary expressions
- [crisp/two-lines-between-class-members](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/two-lines-between-class-members.js) (⚪️): Requires exactly two line breaks between class methods
- [crisp/variable-names](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/variable-names.js) (⚪️🟢): Requires variables defined within a method to start with `_`
