import rule from "../../rules/vue-ref-case.js";
import { createVueRuleTester } from "../rule-tester.js";

const ruleTester = createVueRuleTester();
const filename = "TestComponent.vue";

ruleTester.run("vue-ref-case", rule, {
  valid: [
    {
      filename,
      code: `<template>
  <input ref="email_input">
  <input :ref="dynamicRef">
  <section ref />
</template>

<script setup>
const dynamicRef = "email_input";
</script>`
    }
  ],

  invalid: [
    {
      filename,
      code: `<template>
  <input ref="emailInput">
  <input ref="email-input">
</template>`,
      errors: [
        {
          message: "Ref attribute \"emailInput\" should be snake-cased."
        },
        {
          message: "Ref attribute \"email-input\" should be snake-cased."
        }
      ]
    }
  ]
});
