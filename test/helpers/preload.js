"use strict";
// register modules that are aliased (see package.json)
require("module-alias/register");

const path = require("path");

// load .env variables into environment variables, if .env is available
require("dotenv").config({ path: path.resolve(__dirname, "..", "test.env") });
