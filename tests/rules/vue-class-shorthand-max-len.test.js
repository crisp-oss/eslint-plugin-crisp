import rule from "../../rules/vue-class-shorthand-max-len.js";
import { createPugRuleTester } from "../rule-tester.js";

const ruleTester = createPugRuleTester();
const filename = "TestComponent.vue";

ruleTester.run("vue-class-shorthand-max-len", rule, {
  valid: [
    {
      filename,
      options: [
        {
          max: 9
        }
      ],
      code: `<template lang="pug">
  div.short
</template>`
    },
    {
      filename,
      options: [
        {
          max: 5
        }
      ],
      code: `<template lang="pug">
  UserCard.very-long-class
  user-card.very-long-class
</template>`
    }
  ],

  invalid: [
    {
      filename,
      options: [
        {
          max: 8
        }
      ],
      code: `<template lang="pug">
  div.short
</template>`,
      errors: [
        {
          messageId: "tooLong",
          data: {
            length: 9,
            max: 8
          }
        }
      ]
    },
    {
      filename,
      code: `<template lang="pug">
  div.this-class-name-is-deliberately-long-to-exceed-the-default-maximum-length-without-options-and-report
</template>`,
      errors: [
        {
          messageId: "tooLong"
        }
      ]
    }
  ]
});
