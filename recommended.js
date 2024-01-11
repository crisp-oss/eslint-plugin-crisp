module.exports = {
  env: {
    es6: true,
    node: true
  },

  plugins: [
    "eslint-plugin-jsdoc"
  ],

  extends: [
    "plugin:jsdoc/recommended"
  ],

  settings: {
    jsdoc: {
      tagNamePreference: {
        returns: "return"
      },

      preferredTypes: {
        Function: "function",
        Array: "array",
        Integer: "number"
      }
    }
  },

  rules: {
    // General JS rules
    "arrow-parens": ["error", "always"],
    "brace-style": [
      "error",
      "1tbs",

      {
        "allowSingleLine": true
      }
    ],
    "comma-dangle": ["error", "never"],
    "comma-style": ["error", "last"],
    "curly": "error",
    "default-param-last": "error",
    "default-case-last": "error",
    "dot-notation": "error",
    "eqeqeq": "error",
    "eol-last": "error",
    "for-direction": "error",
    "indent": [
      "error",
      2,

      {
        "SwitchCase": 1,
        "FunctionDeclaration": {
          "parameters": "off"
        },
        "FunctionExpression": {
          "parameters": "off"
        },
        "CallExpression": {
          "arguments": "off"
        },
        "VariableDeclarator": "first",
        "outerIIFEBody": 0,
        "ArrayExpression": "first",
        "ObjectExpression": "first",
        "ImportDeclaration": "first",
        "flatTernaryExpressions": false,
        "ignoredNodes": [
          "BinaryExpression",
          "ConditionalExpression",
          "IfStatement *",
          "VariableDeclarator",
          "VariableDeclarator > CallExpression",
          "CallExpression > ArrayExpression"
        ]
      }
    ],
    "linebreak-style": ["error", "unix"],
    "max-len": ["error", 80],
    "no-console": "warn",
    "no-debugger": "warn",
    "no-eval": "error",
    "no-magic-numbers": [
      "error",

      {
        "ignore": [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 100],
        "ignoreArrayIndexes": true,
        "ignoreDefaultValues": true
      }
    ],
    "no-multi-str": "error",
    "no-mixed-spaces-and-tabs": "error",
    "no-tabs": "error",
    "no-trailing-spaces": "error",
    "no-unused-vars": "warn",
    "no-unsafe-optional-chaining": "error",
    "object-curly-newline": [
      "error",

      {
        "multiline": true, "consistent": true
      }
    ],
    "object-curly-spacing": ["error", "always"],
    "padded-blocks": ["error", "never"],
    "padding-line-between-statements": [
      "error",

      { "blankLine": "always", "prev": "let", "next": "*" },
      { "blankLine": "any", "prev": "let", "next": "let" },
      { "blankLine": "always", "prev": "const", "next": "*" },
      { "blankLine": "any", "prev": "const", "next": "const" },
      { "blankLine": "always", "prev": "block-like", "next": "*" },
      { "blankLine": "always", "prev": "*", "next": "break" },
      { "blankLine": "any", "prev": "empty", "next": "break" },
      { "blankLine": "always", "prev": "*", "next": "block-like" },
      { "blankLine": "any", "prev": "case", "next": "case" },
      { "blankLine": "always", "prev": "continue", "next": "*" },
      { "blankLine": "always", "prev": "break", "next": "*" }
    ],
    "quotes": [
      "error",
      "double",

      {
        "avoidEscape": true, "allowTemplateLiterals": true
      }
    ],
    "quote-props": ["error", "as-needed"],
    "semi": ["error", "always"],
    "semi-style": ["error", "last"],
    "space-before-blocks": "error",
    "space-in-parens": ["error", "never"],

    // Crisp JS rules
    "crisp/align-consecutive-class-assignements": "error",
    "crisp/align-one-var": "error",
    "crisp/align-requires": "error",
    "crisp/const": "error",
    "crisp/constructor-variables": "error",
    "crisp/enforce-optional": "error",
    "crisp/header-check": "error",
    "crisp/header-comments-check": "error",
    "crisp/methods-naming": "error",
    "crisp/methods-ordering": "error",
    "crisp/multiline-comment-end-backslash": "error",
    "crisp/newline-after-switch-case": "error",
    "crisp/no-async": "error",
    "crisp/no-var-in-blocks": "error",
    "crisp/no-space-in-optional-arguments": "error",
    "crisp/one-space-after-operator": "error",
    "crisp/regex-in-constructor": "error",
    "crisp/ternary-parenthesis": "error",
    "crisp/two-lines-between-class-members": "error",
    "crisp/variable-names": "error",

    "crisp/no-short-parameters": [
      "error",

      {
        "exceptions": ["_", "$"]
      }
    ],

    // JSDoc rules
    "jsdoc/no-undefined-types"       : "off",
    "jsdoc/require-param-description": "off",
    "jsdoc/newline-after-description": "off",
    "jsdoc/require-jsdoc": [
      "error",

      {
        require: {
          "FunctionDeclaration": true,
          "MethodDefinition": true,
          "ClassDeclaration": true,
          "ArrowFunctionExpression": false,
          "FunctionExpression": false
        }
      }
    ],
    "jsdoc/sort-tags": [
      "error",

      {
        tagSequence: [
          {
            tags: [
              "private",
              "protected",
              "public",

              "class",

              "classdesc",

              "param",
              "return"
            ]
          }
        ]
      }
    ],

    // Crisp JSDoc rules
    "crisp/jsdoc-align-params": "error",
    "crisp/jsdoc-check-indentation": "error",
    "crisp/jsdoc-enforce-classdesc": "error"
  }
}
