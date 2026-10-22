import rule from "../../rules/two-lines-between-class-members.js";
import createRuleTester from "../rule-tester.js";

const ruleTester = createRuleTester();

ruleTester.run("two-lines-between-class-members", rule, {
  valid: [
    "class Worker { run() {} }",
    `class Worker {
  start() {}


  stop() {}
}`,
    `class Worker {
  active = true;


  run() {}
}`
  ],

  invalid: [
    {
      code: `class Worker {
  start() {}
  stop() {}
}`,
      errors: [
        {
          message: "Expected exactly two line breaks between class methods."
        }
      ]
    },
    {
      code: `class Worker {
  start() {}

  stop() {}
}`,
      errors: [
        {
          message: "Expected exactly two line breaks between class methods."
        }
      ]
    },
    {
      code: `class Worker {
  start() {}



  stop() {}
}`,
      errors: [
        {
          message: "Expected exactly two line breaks between class methods."
        }
      ]
    }
  ]
});
