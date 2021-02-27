#!/usr/bin/env node

require("dotenv").config();
const fs = require("fs");
const path = require("path");

const outputPath = (env) => (process.env.NODE_ENV === "production" ? path.resolve(__dirname, "../static/", env) : path.resolve(__dirname, "../dev/", env));

global.assets = JSON.parse(fs.readFileSync(path.join(outputPath("client"), "manifest-dev.json"), "utf-8"));

require(path.join(outputPath("server"), "app"));
