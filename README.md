
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
* 🟠: enabled in `plugin:crisp/recommended`
* 🟢: enabled in `plugin:crisp/recommended-vue`

### Configurations
- [eslint:recommended](https://github.com/eslint/eslint) (🟢): Core ESLint rules
- [plugin:jsdoc/recommended](https://github.com/gajus/eslint-plugin-jsdoc) (🟠🟢): JSDoc linting rules
- [plugin:vue/vue3-recommended](https://github.com/vuejs/eslint-plugin-vue) (🟢): Vue.js 3 linting rules
- [plugin:vue-pug/vue3-recommended](https://github.com/gajus/eslint-plugin-jsdoc) (🟢): Pug templates support for Vue.js linting rules

### Plugins
- [eslint-plugin-jsdoc](https://github.com/gajus/eslint-plugin-jsdoc) (🟠🟢): JSDoc linting rules for ESLint

### Rules

#### General JS rules
- [arrow-parens](https://eslint.org/docs/latest/rules/arrow-parens) (🟠🟢): Requires parentheses around arrow function arguments
- [brace-style](https://eslint.org/docs/latest/rules/brace-style) (🟠🟢): Enforces one true brace style for blocks
- [comma-dangle](https://eslint.org/docs/latest/rules/comma-dangle) (🟠🟢): Disallows trailing commas
- [comma-style](https://eslint.org/docs/latest/rules/comma-style) (🟠🟢): Requires a comma after and on the same line
- [curly](https://eslint.org/docs/latest/rules/curly) (🟠🟢): Ensures block statements are always wrapped in curly braces
- [computed-property-spacing](https://eslint.org/docs/latest/rules/computed-property-spacing) (🟢): Disallows spaces inside computed property brackets
- [default-param-last](https://eslint.org/docs/latest/rules/default-param-last) (🟠🟢): Enforces default parameters to be last
- [default-case-last](https://eslint.org/docs/latest/rules/default-case-last) (🟠🟢): Enforces default clauses in switch statements to be last
- [dot-notation](https://eslint.org/docs/latest/rules/dot-notation) (🟠🟢): Enforces dot notation instead of square-bracket notation
- [eqeqeq](https://eslint.org/docs/latest/rules/eqeqeq) (🟠🟢): Requires the use of `===` and `!==`
- [eol-last](https://eslint.org/docs/latest/rules/eol-last) (🟠🟢): Requires newline at the end of files
- [indent](https://eslint.org/docs/latest/rules/indent) (🟠🟢): Enforces 2-space indentation, and specific indentation levels for some nodes
- [for-direction](https://eslint.org/docs/latest/rules/for-direction) (🟠🟢): Prevents for-loops to have stop condition that can never be reached
- [key-spacing](https://eslint.org/docs/latest/rules/key-spacing) (🟢): Enforces consistent spacing in object literal properties (no space between the key and the colon, one space between the colon and the value)
- [linebreak-style](https://eslint.org/docs/latest/rules/linebreak-style) (🟠🟢): Enforces Unix-style line endings
- [max-len](https://eslint.org/docs/latest/rules/max-len) (🟠): Enforces a maximum line length of 80 characters
- [newline-per-chained-call](https://eslint.org/docs/latest/rules/newline-per-chained-call) (🟢): Requires a newline after each call in a method chain
- [no-console](https://eslint.org/docs/latest/rules/no-console) (🟠🟢): Disallows the use of `console`
- [no-debugger](https://eslint.org/docs/latest/rules/no-debugger) (🟠🟢): Disallows the use of `debugger`
- [no-eval](https://eslint.org/docs/latest/rules/no-eval) (🟠🟢): Disallows the use of `eval`
- [no-magic-numbers](https://eslint.org/docs/latest/rules/no-magic-numbers) (🟠): Disallows magic numbers (except the ones in the context of array indexes and in default value assignments)
- [no-multi-str](https://eslint.org/docs/latest/rules/no-multi-str) (🟠🟢): Disallows multiline strings
- [no-multiple-empty-lines](https://eslint.org/docs/latest/rules/no-multiple-empty-lines) (🟢): Allows a maximum of 1 consecutive empty lines
- [no-mixed-spaces-and-tabs](https://eslint.org/docs/latest/rules/no-mixed-spaces-and-tabs) (🟠🟢): Disallows mixed spaces and tabs for indentation
- [no-restricted-syntax](https://eslint.org/docs/latest/rules/no-restricted-syntax) (🟢): Enforces `switch` `case`'s content to be enclosed in braces
- [no-tabs](https://eslint.org/docs/latest/rules/no-tabs) (🟠🟢): Disallows tabs
- [no-trailing-spaces](https://eslint.org/docs/latest/rules/no-trailing-spaces) (🟠🟢): Disallows trailing whitespace at the end of lines
- [no-unused-vars](https://eslint.org/docs/latest/rules/no-unused-vars) (🟠🟢): Disallows unused variables
- [no-unsafe-optional-chaining](https://eslint.org/docs/latest/rules/no-unsafe-optional-chaining) (🟠🟢): Disallows use of optional chaining in contexts where the `undefined` value is not allowed
- [object-curly-newline](https://eslint.org/docs/latest/rules/object-curly-newline) (🟠🟢): Requires line breaks after opening and before closing braces
- [object-curly-spacing](https://eslint.org/docs/latest/rules/object-curly-spacing) (🟠🟢): Requires spacing inside of braces
- [padded-blocks](https://eslint.org/docs/latest/rules/padded-blocks) (🟠🟢): Disallows empty lines at the beginning and ending of blocks
- [padding-line-between-statements](https://eslint.org/docs/latest/rules/padding-line-between-statements) (🟠🟢): Requires padding lines between various statements
- [prefer-arrow-callback](https://eslint.org/docs/latest/rules/prefer-arrow-callback) (🟢): Requires using arrow functions for callbacks
- [quotes](https://eslint.org/docs/latest/rules/quotes) (🟠🟢): Enforces the consistent use of double quotes (while allowing single quotes in order to avoid escape, and backticks for template literals)
- [quote-props](https://eslint.org/docs/latest/rules/quote-props) (🟠🟢): Disallows quotes around object literal property names that are not strictly required
- [semi](https://eslint.org/docs/latest/rules/semi) (🟠🟢): Requires semicolons at the end of statements
- [semi-style](https://eslint.org/docs/latest/rules/semi-style) (🟠🟢): Enforces that semicolons are at the end of statements
- [semi-spacing](https://eslint.org/docs/latest/rules/semi-spacing) (🟢): Disallows space before semicolons, enforces spaces after
- [space-before-blocks](https://eslint.org/docs/latest/rules/space-before-blocks) (🟠🟢): Enforces consistent spacing before blocks
- [space-in-parens](https://eslint.org/docs/latest/rules/space-in-parens) (🟠🟢): Enforces zero spaces inside of parentheses

#### Crisp JS rules
- [crisp/align-consecutive-class-assignements](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/align-consecutive-class-assignements.js) (🟠): Enforces alignment of consecutive assignment statements in a class constructor
- [crisp/align-one-var](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/align-one-var.js) (🟠): Enforces alignment of variables in 'one-var' statements
- [crisp/align-requires](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/align-requires.js) (🟠): Enforces alignment of require statements
- [crisp/const](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/const.js) (🟠): Enforces that `const` variables start with `__` or are all uppercase
- [crisp/constructor-variables](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/constructor-variables.js) (🟠): Ensures all class properties in the constructor start with `_`
- [crisp/enforce-optional](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/enforce-optional.js) (🟠🟢): Enforces use of optional chaining
- [crisp/header-check](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/header-check.js) (🟠🟢): Enforces files to start with Crisp header
- [crisp/header-comments-check](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/header-comments-check.js) (🟠🟢): Enforces different comment blocks before different groups (imports, constants, instances and exports)
- [crisp/methods-naming](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/methods-naming.js) (🟠🟢): Ensures methods are named according to their access (`public`, `private`, `protected`)
- [crisp/methods-ordering](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/methods-ordering.js) (🟠🟢): Ensures methods order according to their access: `public` then `protected` then `private`
- [crisp/multiline-comment-end-backslash](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/multiline-comment-end-backslash.js) (🟠🟢): Enforces multiline comments to end with a backslash
- [crisp/newline-after-switch-case](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/newline-after-switch-case.js) (🟠🟢): Requires newline between switch cases
- [crisp/no-async](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/no-async.js) (🟠🟢): Disallows the use of `async/syntax`, in favor of `Promise`
- [crisp/no-short-parameters](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/no-short-parameters.js) (🟠🟢): Disallow parameter names shorter than 3 characters
- [crisp/no-space-in-optional-arguments](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/no-space-in-optional-arguments.js) (🟠): Disallows space before or after `=` in optional parameters
- [crisp/no-useless-template-literals](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/no-useless-template-literals.js) (🟢): Disallows unnecessary use of template literals
- [crisp/no-var-in-blocks](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/no-var-in-blocks.js) (🟠🟢): Disallows `var` declarations inside function, method, or class block
- [crisp/one-space-after-operator](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/one-space-after-operator.js) (🟠🟢): Enforces at least one space before and one space after `=` and `:` operators
- [crisp/regex-in-constructor](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/regex-in-constructor.js) (🟠🟢): Ensures regular expressions are defined in the class constructor
- [crisp/ternary-parenthesis](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/ternary-parenthesis.js) (🟠🟢): Enforces parentheses around conditions with operators in ternary expressions
- [crisp/two-lines-between-class-members](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/two-lines-between-class-members.js) (🟠): Requires exactly two line breaks between class methods
- [crisp/variable-names](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/variable-names.js) (🟠🟢): Requires variables defined within a method to start with `_`

#### General JSDoc rules
- [jsdoc/no-undefined-types](https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/no-undefined-types.md) (🟠): Rule is **disabled** to allow some undefined types
- [jsdoc/require-description](https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/require-description.md) (🟢): Requires all functions to have a description in their JSDoc
- [jsdoc/require-param-description](https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/require-param-description.md) (🟠🟢): Rule is **disabled** as we don't write any description for `@param` tags
- [jsdoc/require-jsdoc](https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/require-jsdoc.md) (🟠🟢): Enforces JSDoc comments on functions and classes
- [jsdoc/sort-tags](https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/sort-tags.md) (🟠🟢): Enforces specific order for tags

#### Crisp JSDoc rules
- [crisp/jsdoc-align-params](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/jsdoc-align-params.js) (🟠🟢): Enforces various alignments
- [crisp/jsdoc-check-indentation](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/jsdoc-check-indentation.js) (🟠🟢): Enforces consistent indentation
- [crisp/jsdoc-check-optional-params](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/jsdoc-check-optional-params.js) (🟢): Requires optional parameters to be surrounded by brackets
- [crisp/jsdoc-enforce-access](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/jsdoc-enforce-access.js) (🟢): Requires one of `@public`, `@private`, or `@protected` for functions
- [crisp/jsdoc-enforce-classdesc](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/jsdoc-enforce-classdesc.js) (🟠🟢): Ensures JSDoc for class headers to include a non-empty `@classdesc`

#### General Vue rules
- [vue/attributes-order](https://eslint.vuejs.org/rules/attributes-order) (🟢): Enforces order of attributes
- [vue/block-lang](https://eslint.vuejs.org/rules/block-lang) (🟢): Allows `script` blocks to have no `lang` attribute
- [vue/block-order](https://eslint.vuejs.org/rules/block-order) (🟢): Enforces order of component top-level elements (`template`, then `script`, then `style`)
- [vue/block-tag-newline](https://eslint.vuejs.org/rules/block-tag-newline) (🟢): Requires one line break after opening and before closing block-level tags
- [vue/comma-dangle](https://eslint.vuejs.org/rules/comma-dangle) (🟢): Disallows trailing commas in `<template>`
- [vue/component-api-style](https://eslint.vuejs.org/rules/component-api-style) (🟢): Enforces Options API style
- [vue/component-name-in-template-casing](https://eslint.vuejs.org/rules/component-name-in-template-casing) (🟢): Enforces tag names to kebab case
- [vue/component-options-name-casing](https://eslint.vuejs.org/rules/component-options-name-casing) (🟢): Enforces component names in `components` options to pascal case
- [vue/custom-event-name-casing](https://eslint.vuejs.org/rules/custom-event-name-casing) (🟢): Enforces custom event names to camel case
- [vue/eqeqeq](https://eslint.vuejs.org/rules/eqeqeq) (🟢): Requires the use of `===` and `!==` in `<template>`
- [vue/html-comment-content-spacing](https://eslint.vuejs.org/rules/html-comment-content-spacing) (🟢): Requires one space before and after HTML comment tags
- [vue/html-quotes](https://eslint.vuejs.org/rules/html-quotes) (🟢): Rule is **disabled** in order to allow backticks in HTML attributes
- [vue/key-spacing](https://eslint.vuejs.org/rules/key-spacing) (🟢): Enforces consistent spacing in object literal properties in `<template>` (no space between the key and the colon, one space between the colon and the value)
- [vue/match-component-import-name](https://eslint.vuejs.org/rules/match-component-import-name) (🟢): Requires the registered component name to match the imported component name
- [vue/new-line-between-multi-line-property](https://eslint.vuejs.org/rules/new-line-between-multi-line-property) (🟢): Requires new lines between multi-line `props`
- [vue/no-bare-strings-in-template](https://eslint.vuejs.org/rules/no-bare-strings-in-template) (🟢): Disallows the use of bare strings in `<template>`
- [vue/no-irregular-whitespace](https://eslint.vuejs.org/rules/no-irregular-whitespace) (🟢): Disallows irregular / invalid whitespaces
- [vue/no-multiple-objects-in-class](https://eslint.vuejs.org/rules/no-multiple-objects-in-class) (🟢): Disallows to pass multiple objects into array to `class` HTML property
- [vue/no-mutating-props](https://eslint.vuejs.org/rules/no-mutating-props) (🟢): Disallows mutation of component props (except shallow mutation)
- [vue/no-static-inline-styles](https://eslint.vuejs.org/rules/no-static-inline-styles) (🟢): Disallows static inline style attributes
- [vue/no-use-v-else-with-v-for](https://eslint.vuejs.org/rules/no-use-v-else-with-v-for) (🟢): Disallows using `v-else-if/v-else` on the same element as `v-for` (works but confusing)
- [vue/no-useless-v-bind](https://eslint.vuejs.org/rules/no-useless-v-bind) (🟢): Disallows unnecessary `v-bind` directives
- [vue/no-v-html](https://eslint.vuejs.org/rules/no-v-html) (🟢): Rule is **disabled** in order to allow the use of `v-html`
- [vue/padding-line-between-blocks](https://eslint.vuejs.org/rules/padding-line-between-blocks) (🟢): Requires padding lines between blocks
- [vue/padding-lines-in-component-definition](https://eslint.vuejs.org/rules/padding-lines-in-component-definition) (🟢): Requires padding lines in component definition
- [vue/prefer-true-attribute-shorthand](https://eslint.vuejs.org/rules/prefer-true-attribute-shorthand) (🟢): Requires shorthand form attribute when `v-bind` value is `true`
- [vue/require-direct-export](https://eslint.vuejs.org/rules/require-direct-export) (🟢): Requires the component to be directly exported
- [vue/v-for-delimiter-style](https://eslint.vuejs.org/rules/v-for-delimiter-style) (🟢): Enforces the use of `in` delimiter in `v-for` directive
- [vue/v-slot-style](https://eslint.vuejs.org/rules/v-slot-style) (🟢): Disallows `v-slot` shorthand style

#### Crisp Vue rules
- [crisp/vue-computed-order](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/vue-computed-order.js) (🟢): Ensures computed properties are alphabetically ordered
- [crisp/vue-emits-order](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/vue-emits-order.js) (🟢): Ensures emits properties are alphabetically ordered
- [crisp/vue-header-check](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/vue-header-check.js) (🟢): Ensures `script`, `template` and `style` tags start with corresponding comment block
- [crisp/vue-html-quotes](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/vue-html-quotes.js) (🟢): Enforces HTML attributes to be enclosed with double quotes
- [crisp/vue-no-regex-data](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/vue-no-regex-data.js) (🟢): Disallows regular expressions to be declared in Vue data object
- [crisp/vue-props-declaration-multiline](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/vue-props-declaration-multiline.js) (🟢): Enforces props declarations to be multiline
- [crisp/vue-props-declaration-order](https://github.com/crisp-oss/eslint-plugin-crisp/blob/master/rules/vue-props-declaration-order.js) (🟢): Ensures props declarations are alphabetically ordered


## License

eslint-plugin-crisp is released under the MIT License. See the bundled LICENSE file for details.
