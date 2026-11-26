import rule from "../../rules/newline-after-switch-case.js";
import createRuleTester from "../rule-tester.js";

const ruleTester = createRuleTester();

ruleTester.run("newline-after-switch-case", rule, {
  valid: [
    {
      code: `switch (value) {
  case 1:
    run();
    break;

  case 2:
    stop();
}`
    },
    {
      code: `switch (value) {
  case 1:
  case 2:
    run();
}`
    },
    {
      code: `switch (value) {
  default:
    run();
}`
    }
  ],

  invalid: [
    {
      code: `switch (value) {
  case 1:
    run();
    break;
  case 2:
    stop();
}`,
      output: `switch (value) {
  case 1:
    run();
    break;

  case 2:
    stop();
}`,
      errors: [
        {
          message: "Newline required between switch cases."
        }
      ]
    },
    {
      code: `switch (value) {
  case 1:

  case 2:
    run();
}`,
      output: `switch (value) {
  case 1:
  case 2:
    run();
}`,
      errors: [
        {
          message: "Extraneous newlines between switch cases."
        }
      ]
    }
  ]
});
