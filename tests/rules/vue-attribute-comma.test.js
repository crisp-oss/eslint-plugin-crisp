import rule from "../../rules/vue-attribute-comma.js";
import { createVueRuleTester } from "../rule-tester.js";

const ruleTester = createVueRuleTester();
const filename = "TestComponent.vue";

ruleTester.run("vue-attribute-comma", rule, {
  valid: [
    {
      filename,
      code: `<template>
  <button type="button" :aria-label="label">Save, now</button>
</template>

<script setup>
const label = "Save";
</script>`
    },
    {
      filename,
      code: `<template>
  <Widget disabled />
</template>`
    }
  ],

  invalid: [
    {
      filename,
      code: `<template>
  <button type="button", disabled>Save</button>
</template>`,
      output: `<template>
  <button type="button" disabled>Save</button>
</template>`,
      errors: [
        {
          message: "Comma after attribute value is not allowed."
        }
      ]
    }
  ]
});
