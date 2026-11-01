import rule from "../../rules/vue-html-quotes.js";
import { createVueRuleTester } from "../rule-tester.js";

const ruleTester = createVueRuleTester();
const filename = "TestComponent.vue";

ruleTester.run("vue-html-quotes", rule, {
  valid: [
    {
      filename,
      code: `<template>
  <button title="Save" :aria-label="label">Save</button>
</template>

<script setup>
const label = "Save";
</script>`
    },
    {
      filename,
      options: ["single"],
      code: `<template>
  <button title='Save'>Save</button>
</template>`
    },
    {
      filename,
      options: [
        "single",
        {
          avoidEscape: true
        }
      ],
      code: `<template>
  <p title="It's ready">Ready</p>
</template>`
    }
  ],

  invalid: [
    {
      filename,
      code: `<template>
  <button title='Save'>Save</button>
</template>`,
      errors: [
        {
          messageId: "expected",
          data: {
            kind: "double quotes"
          }
        }
      ]
    },
    {
      filename,
      options: ["single"],
      code: `<template>
  <button title="Save">Save</button>
</template>`,
      errors: [
        {
          messageId: "expected",
          data: {
            kind: "single quotes"
          }
        }
      ]
    }
  ]
});
