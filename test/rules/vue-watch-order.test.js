import rule from "../../rules/vue-watch-order.js";
import { createVueRuleTester } from "../rule-tester.js";

const ruleTester = createVueRuleTester();

function component(options) {
  return `export default { watch: { value: { ${options} } } };`;
}

ruleTester.run("vue-watch-order", rule, {
  valid: [
    ...[
      "immediate: true, deep: true, handler(value) {}",
      "immediate: false, deep: 2, handler() {}",
      "immediate: true, handler() {}",
      "deep: true, handler() {}",
      "handler() {}",
      "immediate: true, deep: true",
      "immediate: true",
      "",
      '"immediate": true, "deep": true, "handler": () => {}',
      "immediate: true, flush: 'post', deep: true, handler() {}"
    ].map((options) => ({ code: component(options) })),
    {
      code: "const options = { watch: { value: { handler() {}, deep: true } } };"
    },
    {
      code: "export default { methods: { value: { handler() {}, deep: true } } };"
    },
    {
      code: "export default { watch: { value() {}, other: 'onOther', ...watchers } };"
    },
    {
      code: "export default { watch: getWatchers() };"
    },
    {
      code: component("handler() { const nested = { deep: true, immediate: true }; }")
    },
    {
      code: component("[option]: true, handler() {}")
    }
  ],

  invalid: [
    ...[
      [
        "deep: true, immediate: true, handler(value) {}",
        "immediate: true, deep: true, handler(value) {}"
      ],
      [
        "handler() {}, deep: true, immediate: false",
        "immediate: false, deep: true, handler() {}"
      ],
      [
        "handler: (value) => {}, immediate: true",
        "immediate: true, handler: (value) => {}"
      ],
      ["handler() {}, deep: 2", "deep: 2, handler() {}"],
      ["deep: true, immediate: true", "immediate: true, deep: true"],
      [
        '"handler": function() {}, "deep": true, "immediate": true,',
        '"immediate": true, "deep": true, "handler": function() {},'
      ],
      [
        "handler() { /* keep inside handler */ }, deep: true",
        "deep: true, handler() { /* keep inside handler */ }"
      ]
    ].map(([input, output]) => ({
      code: component(input),
      output: component(output),
      errors: [{ messageId: "order" }]
    })),
    {
      code: `export default defineComponent({
  watch: {
    "$route.params": {
      deep: true,
      immediate: true,

      handler(value) {
        this.websiteId = value.websiteId;
      }
    }
  }
});`,
      output: `export default defineComponent({
  watch: {
    "$route.params": {
      immediate: true,
      deep: true,

      handler(value) {
        this.websiteId = value.websiteId;
      }
    }
  }
});`,
      errors: [{ messageId: "order" }]
    },
    {
      code: 'export default Vue.defineComponent({ "watch": { value: { handler() {}, deep: true } } });',
      output: 'export default Vue.defineComponent({ "watch": { value: { deep: true, handler() {} } } });',
      errors: [{ messageId: "order" }]
    },
    {
      filename: "Component.vue",
      code: `<script>${component("handler() {}, immediate: true")}</script>`,
      output: `<script>${component("immediate: true, handler() {}")}</script>`,
      errors: [{ messageId: "order" }]
    },
    ...[
      "// Trigger on array mutations\n deep: true, immediate: true, handler() {}",
      "handler() {}, /* Run immediately */ immediate: true",
      "handler() {}, ...options, immediate: true",
      "handler() {}, [option]: true, immediate: true",
      "handler() {}, flush: 'post', immediate: true",
      "handler() {}, deep: true, deep: false",
      "handler() {}, immediate: getImmediate()",
      "get handler() { return callback; }, immediate: true"
    ].map((options) => ({
      code: component(options),
      output: null,
      errors: [{ messageId: "order" }]
    })),
    {
      code: "export default { watch: { first: { handler() {}, deep: true }, second: { deep: true, immediate: true } } };",
      output: "export default { watch: { first: { deep: true, handler() {} }, second: { immediate: true, deep: true } } };",
      errors: [{ messageId: "order" }, { messageId: "order" }]
    }
  ]
});
