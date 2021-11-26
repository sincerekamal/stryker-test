"use strict";
const { DateTime } = require("luxon");

module.exports = {
  time: (joi) => {
    return {
      type: "time",
      base: joi.string(),
      messages: {
        "time.format": `{{#label}} must be in the format: 'HH:MM' in 24hr format`,
        "time.value": `{{#label}} must be a valid 24hr time`,
      },
      validate(value, helpers) {
        if (!/^\d{2}:\d{2}$/.test(value)) {
          return { value, errors: helpers.error(`time.format`) };
        }
        const [h, m] = value.split(":");

        if (parseInt(h) > 23 || parseInt(m) > 59) {
          return { value, errors: helpers.error(`time.value`) };
        }

        return { value };
      },
    };
  },
  fdate: (joi) => {
    return {
      type: "fdate",
      base: joi.string(),
      messages: {
        "fdate.format": `{{#label}} must be in the format: '{{#dateTimeFormat}}'`,
        "fdate.base": `{{#label}} must be in iso format`,
      },
      validate(value, helpers) {
        const formatRule = helpers.schema.$_getRule("format");

        // If format exists, let it return the value,
        // so that validate() inside rules.format will be executed
        if (formatRule) return { value };
        const luxonDateTime = DateTime.fromISO(value);
        if (luxonDateTime.isValid) {
          return { value };
        }
        return { value, errors: helpers.error("fdate.base") };
      },
      rules: {
        format: {
          method(dateTimeFormat) {
            return this.$_addRule({ name: "format", args: { dateTimeFormat } });
          },
          validate(value, helpers, args) {
            const dateObj = DateTime.fromFormat(value, args.dateTimeFormat);

            if (dateObj.isValid) {
              return value;
            }

            return helpers.error("fdate.format", {
              dateTimeFormat: args.dateTimeFormat.split(`'`).join(""),
            });
          },
        },
      },
    };
  },
};
