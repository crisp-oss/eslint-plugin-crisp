import rule from "../../rules/vue-no-mixed-class.js";
import { createVueRuleTester } from "../rule-tester.js";

const ruleTester = createVueRuleTester();
const filename = "TestComponent.vue";

ruleTester.run("vue-no-mixed-class", rule, {
  valid: [
    {
      filename,
      code: `<template>
  <section class="panel">Static</section>
  <section :class="{ active }">Bound</section>
  <section class="panel" :id="sectionId">Other binding</section>
</template>

<script setup>
const active = true;
const sectionId = "details";
</script>`
    }
  ],

  invalid: [
    {
      filename,
      code: `<template>
  <section class="panel" :class="{ active }">Mixed</section>
</template>

<script setup>
const active = true;
</script>`,
      errors: [
        {
          message: "Cannot use both \"class\" and \":class\" on the same element, merge them into \":class\"."
        }
      ]
    },
    {
      filename,
      code: `<template>
  <section class="panel" v-bind:class="classes">Mixed</section>
</template>

<script setup>
const classes = ["active"];
</script>`,
      errors: [
        {
          message: "Cannot use both \"class\" and \":class\" on the same element, merge them into \":class\"."
        }
      ]
    }
  ]
});
