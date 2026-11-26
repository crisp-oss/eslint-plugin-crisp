import assert from "node:assert/strict";
import test from "node:test";
import { Linter } from "eslint";

import plugin from "../../index.js";

const recommendedRules = plugin.configs.recommended.find(
  config => config.rules?.["no-multi-spaces"]
).rules;

test("no-multi-spaces removes legacy assignment alignment with indent", () => {
  const input = `class Example {
  constructor() {
    this.a    = 1;
    this.long = 2;
  }
}

const first = 1,
      second  = 2;

const alpha = require("alpha"),
      beta  = require("beta");
`;
  const expected = `class Example {
  constructor() {
    this.a = 1;
    this.long = 2;
  }
}

const first = 1,
  second = 2;

const alpha = require("alpha"),
  beta = require("beta");
`;
  const result = new Linter().verifyAndFix(input, [{
    rules: {
      indent: recommendedRules.indent,
      "no-multi-spaces": recommendedRules["no-multi-spaces"]
    }
  }]);

  assert.equal(result.output, expected);
});
