import rule from "../../rules/vue-attribute-linebreak.js";
import { createVueRuleTester } from "../rule-tester.js";

const ruleTester = createVueRuleTester();
const filename = "TestComponent.vue";

ruleTester.run("vue-attribute-linebreak", rule, {
  valid: [
    {
      filename,
      code: `<template>
  <section>
    <button
      type="button"
      disabled
    >
      Save
    </button>
  </section>
</template>`
    }
  ],

  invalid: [
    {
      filename,
      code: `<template>
  <button type="button">Save</button>
</template>`,
      errors: [
        {
          message: "Expected a linebreak above this attribute."
        },
        {
          message: "Expected a linebreak below this attribute."
        }
      ]
    },
    {
      filename,
      code: `<template>
  <button type="button"
  >
    Save
  </button>
</template>`,
      errors: [
        {
          message: "Expected a linebreak above this attribute."
        }
      ]
    }
  ]
});
