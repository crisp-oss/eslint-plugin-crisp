import rule from "../../rules/vue-html-indent.js";
import { createVueRuleTester } from "../rule-tester.js";

const ruleTester = createVueRuleTester();
const filename = "TestComponent.vue";

ruleTester.run("vue-html-indent", rule, {
  valid: [
    {
      filename,
      code: `<template>
  <button
    type="button"
  >
    Save
  </button>
</template>`
    },
    {
      filename,
      code: `<template>
  <span>Ready</span>
</template>`
    }
  ],

  invalid: [
    {
      filename,
      code: `<template>
  <button
      type="button"
  >
    Save
  </button>
</template>`,
      output: `<template>
  <button
    type="button"
  >
    Save
  </button>
</template>`,
      errors: [
        {
          message: "Expected attribute indentation of 4 spaces but found 6"
        }
      ]
    },
    {
      filename,
      code: `<template>
   <span>Ready</span>
</template>`,
      errors: [
        {
          message: "Expected element indentation of 2 or 4 spaces but found 3"
        }
      ]
    },
    {
      filename,
      code: `<template>
  <button
    type="button"
    >
    Save
  </button>
</template>`,
      errors: [
        {
          message: "Expected closing tag indentation of 2 spaces but found 4"
        }
      ]
    }
  ]
});
