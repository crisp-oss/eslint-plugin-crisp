import rule from "../../rules/vue-class-attribute-last.js";
import { createVueRuleTester } from "../rule-tester.js";

const ruleTester = createVueRuleTester();
const filename = "TestComponent.vue";

ruleTester.run("vue-class-attribute-last", rule, {
  valid: [
    {
      filename,
      code: `<template>
  <button
    type="button"
    :aria-label="label"
    :class="{ active }"
    class="button"
    disabled
  >
    Save
  </button>
</template>

<script setup>
const active = true;
const label = "Save";
</script>`
    }
  ],

  invalid: [
    {
      filename,
      code: `<template>
  <button class="button" type="button">Save</button>
</template>`,
      errors: [
        {
          message: "Attribute \"type\" must be declared before the \"class\" attribute."
        }
      ]
    },
    {
      filename,
      code: `<template>
  <button :class="{ active }" :aria-label="label">Save</button>
</template>

<script setup>
const active = true;
const label = "Save";
</script>`,
      errors: [
        {
          message: "Attribute \":aria-label\" must be declared before the \":class\" attribute."
        }
      ]
    }
  ]
});
