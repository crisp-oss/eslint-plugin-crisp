import tseslint from "typescript-eslint";

import rule from "../../rules/no-return-only-interface.js";
import createRuleTester from "../rule-tester.js";

const ruleTester = createRuleTester({
  languageOptions: {
    parser: tseslint.parser
  }
});

function error(name) {
  return {
    message: `'${name}' is only used as a function return type, remove it and rely on type inference instead.`
  };
}

ruleTester.run("no-return-only-interface", rule, {
  valid: [
    "function useExample() {\n  return { load() {} };\n}",
    "interface Plan { id: string; }\nfunction getPlan(plans: Plan[]): Plan { return plans[0]; }",
    "interface Plan { id: string; }\nconst plans: Plan[] = [];\nfunction getPlan(): Plan { return plans[0]; }",
    "export interface UseExampleReturn { load: () => void; }\nexport function useExample(): UseExampleReturn { return { load() {} }; }",
    "interface UseExampleReturn { load: () => void; }\nfunction useExample(): UseExampleReturn { return { load() {} }; }\nexport type { UseExampleReturn };",
    "interface Result { value: number; }\ninterface Holder { get: () => Result; }",
    "interface Unused { value: number; }"
  ],

  invalid: [
    {
      code: "interface UseABTestingReturn {\n  loadABTesting: () => void;\n}\n\nfunction useABTesting(): UseABTestingReturn {\n  return { loadABTesting() {} };\n}",
      errors: [error("UseABTestingReturn")]
    },
    {
      code: "type Result = { value: number };\nconst compute = (): Promise<Result> => { return Promise.resolve({ value: 1 }); };",
      errors: [error("Result")]
    },
    {
      code: "interface Options { id: string; }\nclass Example {\n  build(): Options { return { id: \"\" }; }\n\n  rebuild(): Options { return { id: \"\" }; }\n}",
      errors: [error("Options")]
    }
  ]
});
