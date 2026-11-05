import rule from "../../rules/jsdoc-typedef-align.js";
import createRuleTester from "../rule-tester.js";

const ruleTester = createRuleTester();

ruleTester.run("jsdoc-typedef-align", rule, {
  valid: [
    // Aligned typedef and properties
    "/**\n * @typedef  {object} MapParams\n * @property {number}    concurrency\n * @property {Website[]} websites\n */",

    // Optional and nested properties
    "/**\n * @typedef  {object} Params\n * @property {object} [package]\n * @property {string} package.name\n */",

    // Description line before the typedef
    "/**\n * NotificationAttributes\n * @typedef  {object} NotificationAttributes\n * @property {string}           id\n * @property {User | undefined} user\n */",

    // Typedef name aligned with the property names is left untouched
    "/**\n * @typedef  {object}                ContentWriteData\n * @property {helpdesk_content_path} path\n * @property {string}                [content]\n */",

    // Typedef name aligned, widest type is a property
    "/**\n * @typedef  {object}  MessageOptionsExtra\n * @property {object}  [options]\n * @property {boolean} [options.resolve]\n */",

    // Typedef name aligned, widest type is the typedef itself
    "/**\n * @typedef  {object} Params\n * @property {any}    value\n */",

    // Indented block
    "class A {\n  /**\n   * @typedef  {object} Params\n   * @property {string} name\n   */\n}",

    // Single line typedef is ignored
    "/** @typedef {string} Name */",

    // Typedef without properties is ignored
    "/**\n * @typedef {Model & Attributes} Notification\n */",

    // Multiline property types are ignored
    "/**\n * @typedef {object} AppInterface\n * @property {{\n    amqp?: string;\n  }} managers\n * @property {string} path\n */",

    // Regular comments are ignored
    "/*\n * @typedef {object} Params\n * @property {string} name\n */"
  ],

  invalid: [
    // Typedef not aligned with properties and property names not aligned
    {
      code: "/**\n * @typedef {object} MapParams\n * @property {number} concurrency\n * @property {Billing} card\n * @property {Website[]} websites\n */",
      output: "/**\n * @typedef  {object} MapParams\n * @property {number}    concurrency\n * @property {Billing}   card\n * @property {Website[]} websites\n */",
      errors: [
        { messageId: "typedefAlignment" },
        { messageId: "propertyAlignment" },
        { messageId: "propertyAlignment" }
      ]
    },

    // Only the typedef is misaligned
    {
      code: "/**\n * @typedef {object} Params\n * @property {string} name\n */",
      output: "/**\n * @typedef  {object} Params\n * @property {string} name\n */",
      errors: [{ messageId: "typedefAlignment" }]
    },

    // A property was added with a longer type and others were not realigned
    {
      code: "/**\n * @typedef  {object} Website\n * @property {string}  id\n * @property {\"auto\" | \"dark\"} mode\n */",
      output: "/**\n * @typedef  {object} Website\n * @property {string}          id\n * @property {\"auto\" | \"dark\"} mode\n */",
      errors: [{ messageId: "propertyAlignment" }]
    },

    // Stale padding left after removing the longest property
    {
      code: "/**\n * @typedef  {object} Params\n * @property {any}              params\n * @property {string}           [method]\n */",
      output: "/**\n * @typedef  {object} Params\n * @property {any}    params\n * @property {string} [method]\n */",
      errors: [
        { messageId: "propertyAlignment" },
        { messageId: "propertyAlignment" }
      ]
    },

    // Typedef name aligned on a stale column is realigned with the properties
    {
      code: "/**\n * @typedef  {object}   QuickTourStep\n * @property {string}  id\n * @property {string}  [label]\n * @property {boolean} [hidden]\n */",
      output: "/**\n * @typedef  {object}  QuickTourStep\n * @property {string}  id\n * @property {string}  [label]\n * @property {boolean} [hidden]\n */",
      errors: [{ messageId: "typedefAlignment" }]
    },

    // Typedef name aligned, properties padded too much
    {
      code: "/**\n * @typedef  {object}           APIRequest\n * @property {any}              params\n * @property {string}           [method]\n */",
      output: "/**\n * @typedef  {object} APIRequest\n * @property {any}    params\n * @property {string} [method]\n */",
      errors: [
        { messageId: "typedefAlignment" },
        { messageId: "propertyAlignment" },
        { messageId: "propertyAlignment" }
      ]
    },

    // Description after the name is preserved
    {
      code: "/**\n * @typedef {object} Params\n * @property {string} name The name\n * @property {number} age The age\n */",
      output: "/**\n * @typedef  {object} Params\n * @property {string} name The name\n * @property {number} age The age\n */",
      errors: [{ messageId: "typedefAlignment" }]
    },

    // Indented block
    {
      code: "class A {\n  /**\n   * @typedef {object} Params\n   * @property {number} id\n   * @property {string} name\n   */\n}",
      output: "class A {\n  /**\n   * @typedef  {object} Params\n   * @property {number} id\n   * @property {string} name\n   */\n}",
      errors: [{ messageId: "typedefAlignment" }]
    }
  ]
});
