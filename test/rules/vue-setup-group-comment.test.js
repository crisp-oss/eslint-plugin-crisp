import tseslint from "typescript-eslint";

import rule from "../../rules/vue-setup-group-comment.js";
import { createVueRuleTester } from "../rule-tester.js";

const ruleTester = createVueRuleTester({
  languageOptions: {
    parserOptions: {
      parser: tseslint.parser
    }
  }
});
const filename = "TestComponent.vue";

function script(body) {
  return `<script setup lang="ts">\n${body}\n</script>`;
}

ruleTester.run("vue-setup-group-comment", rule, {
  valid: [
    {
      filename,
      code: script(`// PROPS
const { label } = defineProps<{ label: string }>();

// MODEL
const modelValue = defineModel<number>();
const opened = defineModel<boolean>("opened");

// EMITS
const emit = defineEmits<{ change: [value: number] }>();

// COMPUTED
const double = computed(() => {
  return modelValue.value * 2;
});

const triple = computed(() => {
  return modelValue.value * 3;
});`)
    },
    {
      filename,
      code: script(`// PROPS
// Notice: props are declared at runtime, to keep the validator
const props = withDefaults(defineProps<{ size?: number }>(), {
  size: 1
});`)
    },
    {
      filename,
      code: script(`// EMITS
defineEmits(["change"]);`)
    },
    {
      filename,
      code: script(`const trackRef = useTemplateRef<HTMLElement>("track_ref");
const value = ref(0);`)
    },
    {
      filename: "test.ts",
      code: "const double = computed(() => {\n  return 2;\n});"
    }
  ],

  invalid: [
    {
      filename,
      code: script(`const { label } = defineProps<{ label: string }>();`),
      output: script(`// PROPS
const { label } = defineProps<{ label: string }>();`),
      errors: [
        {
          message: "PROPS declarations must be preceded by a '// PROPS' comment."
        }
      ]
    },
    {
      filename,
      code: script(`// MODELS
const modelValue = defineModel<number>();`),
      output: script(`// MODEL
const modelValue = defineModel<number>();`),
      errors: [
        {
          message: "MODEL declarations must be preceded by a '// MODEL' comment."
        }
      ]
    },
    {
      filename,
      code: script(`// Notice: some notice
const emit = defineEmits<{ change: [] }>();`),
      output: script(`// EMITS
// Notice: some notice
const emit = defineEmits<{ change: [] }>();`),
      errors: [
        {
          message: "EMITS declarations must be preceded by a '// EMITS' comment."
        }
      ]
    },
    {
      filename,
      code: script(`// COMPUTED

const double = computed(() => {
  return 2;
});`),
      output: script(`// COMPUTED
const double = computed(() => {
  return 2;
});`),
      errors: [
        {
          message: "COMPUTED declarations must be preceded by a '// COMPUTED' comment."
        }
      ]
    },
    {
      filename,
      code: script(`// COMPUTED
const double = computed(() => {
  return 2;
});

const value = ref(0);

const triple = computed(() => {
  return 3;
});`),
      output: script(`// COMPUTED
const double = computed(() => {
  return 2;
});

const value = ref(0);

// COMPUTED
const triple = computed(() => {
  return 3;
});`),
      errors: [
        {
          message: "COMPUTED declarations must be preceded by a '// COMPUTED' comment."
        }
      ]
    }
  ]
});
