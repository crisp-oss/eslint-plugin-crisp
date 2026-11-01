import rule from "../../rules/vue-name-prop.js";
import { createVueRuleTester } from "../rule-tester.js";

const ruleTester = createVueRuleTester();
const filename = "TestComponent.vue";

ruleTester.run("vue-name-prop", rule, {
  valid: [
    {
      filename,
      code: `<template>
  <field-input name="user_name" />
  <field-select :name="fieldName" />
  <custom-input name="UserName" />
</template>

<script setup>
const fieldName = "user_name";
</script>`
    }
  ],

  invalid: [
    {
      filename,
      code: `<template>
  <field-input name="UserName" />
</template>`,
      output: `<template>
  <field-input name="user_name" />
</template>`,
      errors: [
        {
          messageId: "invalidFormName",
          data: {
            nameValue: "UserName"
          }
        }
      ]
    },
    {
      filename,
      code: `<template>
  <field-select name="billing-address" />
</template>`,
      output: `<template>
  <field-select name="billing_address" />
</template>`,
      errors: [
        {
          messageId: "invalidFormName",
          data: {
            nameValue: "billing-address"
          }
        }
      ]
    }
  ]
});
