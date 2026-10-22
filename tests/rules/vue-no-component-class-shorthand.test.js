import rule from "../../rules/vue-no-component-class-shorthand.js";
import { createPugRuleTester } from "../rule-tester.js";

const ruleTester = createPugRuleTester();
const filename = "TestComponent.vue";

ruleTester.run("vue-no-component-class-shorthand", rule, {
  valid: [
    {
      filename,
      code: `<template lang="pug">
  div.panel
  UserCard(class="panel")
  user-card(class="panel")
</template>`
    }
  ],

  invalid: [
    {
      filename,
      code: `<template lang="pug">
  UserCard.panel
</template>`,
      errors: [
        {
          messageId: "useClassAttribute",
          data: {
            name: "UserCard"
          }
        }
      ]
    },
    {
      filename,
      code: `<template lang="pug">
  user-card.panel
</template>`,
      errors: [
        {
          messageId: "useClassAttribute",
          data: {
            name: "user-card"
          }
        }
      ]
    }
  ]
});
