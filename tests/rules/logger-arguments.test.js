import rule from "../../rules/logger-arguments.js";
import createRuleTester from "../rule-tester.js";

const ruleTester = createRuleTester();

ruleTester.run("logger-arguments", rule, {
  valid: [
    "App.logger.info(\"Application ready.\");",
    "App.logger.debug(\"Found %s jobs at %s/%s\", cronJobs.length, JOBS_PATH, cronName);",
    "app.logger.warn(\"Request failed\", error);",
    "this._app.logger.error(\"Request failed: %s\", this.error.message);",
    "App[\"logger\"][\"info\"](\"Loaded value: %s\", values[index]);",
    `App.logger.info(
  "Loaded value: %s",
  value
);`,
    "App.logger.info(\"This intentionally long logger message may exceed the usual source line length when necessary.\");",
    "App.logger.debug(\"Loaded value: %s\", value || \"default\");",
    "App.logger.debug(\"Loaded value: %s\", this.value ?? \"none\");",
    "App.logger.debug(\"Loaded value: %s\", first || second || \"none\");",
    "App.logger.debug(\"Loaded value: %s\", { user: userId || \"none\" });",
    "if (App.logger.levels.error === true) { App.logger.error(\"Purge failed: %s\", buckets.join(\", \"), error); }",
    "if (App.logger.levels.warn === true) { App.logger.warn(fn_log_format()); }",
    "if (App.logger.levels.error === true && other) { if (x) { App.logger.error(\"Slow: %s\", a + b); } }",
    "if (this._app.logger.levels.debug) { this._app.logger.debug(\"Count: %s\", list.length + 1); }",
    "App.logger.error(\"Failed\", { params: (request.params || {}) });",
    "App.logger.error(\"Failed: %s\", list || []);",
    "App.logger.warn(\"Shutting down\", { bufferedCount });",
    "App.logger.warn(\"Shutting down\", { count: this.count, ...meta });",
    "App.logger.warn(\"Shutting down\", { nested: { bufferedCount } }, logMeta);",
    "App.logger.child({ namespace: \"worker\" });",
    "console.info(`Unrelated logger calls are ignored: ${value}`);"
  ],

  invalid: [
    {
      code: "App.logger.info('Application ready.');",
      errors: [
        {
          messageId: "message"
        }
      ]
    },
    {
      code: "App.logger.info(`Application ready.`);",
      errors: [
        {
          messageId: "message"
        }
      ]
    },
    {
      code: "App.logger.info(`Loaded value: ${value}`);",
      errors: [
        {
          messageId: "message"
        }
      ]
    },
    {
      code: "App.logger.info(\"Loaded \" + value);",
      errors: [
        {
          messageId: "message"
        }
      ]
    },
    {
      code: "App.logger.info(message);",
      errors: [
        {
          messageId: "message"
        }
      ]
    },
    {
      code: "App.logger.info();",
      errors: [
        {
          messageId: "message"
        }
      ]
    },
    {
      code: "App.logger.debug(\"Loaded values: %s\", values.join(\", \"));",
      errors: [
        {
          messageId: "reference"
        }
      ]
    },
    {
      code: "App.logger.debug(\"Loaded value: %s\", value || compute());",
      errors: [
        {
          messageId: "reference"
        }
      ]
    },
    {
      code: "App.logger.debug(\"Loaded value: %s\", value && \"default\");",
      errors: [
        {
          messageId: "reference"
        }
      ]
    },
    {
      code: "App.logger.debug(\"Loaded value: %s\", JSON.stringify(value));",
      errors: [
        {
          messageId: "reference"
        }
      ]
    },
    {
      code: "App.logger.debug(\"Loaded value: %s\", { value: value.trim() });",
      errors: [
        {
          messageId: "reference"
        }
      ]
    },
    {
      code: "App.logger.debug(\"Loaded value: %s\", { value: 3 });",
      errors: [
        {
          messageId: "reference"
        }
      ]
    },
    {
      code: "if (App.logger.levels.error === true) {} else { App.logger.error(\"Purge: %s\", buckets.join(\", \")); }",
      errors: [
        {
          messageId: "reference"
        }
      ]
    },
    {
      code: "if (enabled) { App.logger.error(\"Purge: %s\", buckets.join(\", \")); }",
      errors: [
        {
          messageId: "reference"
        }
      ]
    },
    {
      code: "App.logger.debug(\"Retry count: %s\", 3);",
      errors: [
        {
          messageId: "reference"
        }
      ]
    },
    {
      code: "App.logger.debug(\"Values: %s / %s\", values.join(\", \"), fallback || compute());",
      errors: [
        {
          messageId: "reference"
        },
        {
          messageId: "reference"
        }
      ]
    }
  ]
});
