import rule from "../../rules/vue-no-mixed-class-shorthand.js";
import { createPugRuleTester } from "../rule-tester.js";

const ruleTester = createPugRuleTester();
const filename = "TestComponent.vue";

ruleTester.run("vue-no-mixed-class-shorthand", rule, {
  valid: [
    {
      filename,
      code: `<template lang="pug">
  .panel
  div(:class="classes")
  div(class="panel")
</template>`
    },
    {
      filename,
      code: `<template lang="pug">
  UserCard.panel(:class="classes")
  user-card.panel(class="card")
</template>`
    }
  ],

  invalid: [
    {
      filename,
      code: `<template lang="pug">
  .c-conversation-box-content-message-controls__action(
    @click="onActionTranscribeClick"
    :class="\`js-audio-transcription-action-\${fingerprint}\`"
  )
</template>`,
      errors: [
        {
          messageId: "useClassAttribute"
        }
      ]
    },
    {
      filename,
      code: `<template lang="pug">
  div.panel(class="active")
  section#details.panel(v-bind:class="classes")
</template>`,
      errors: [
        {
          messageId: "useClassAttribute"
        },
        {
          messageId: "useClassAttribute"
        }
      ]
    }
  ]
});
