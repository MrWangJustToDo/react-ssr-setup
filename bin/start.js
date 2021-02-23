#!/usr/bin/env node

require("dotenv").config();
const fs = require("fs");
const path = require("path");

const outputPath = (env) => {
  if (env === "client") {
    return process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "../static/client")
      : path.resolve(__dirname, "../dev/client");
  } else {
    return process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "../static/server")
      : path.resolve(__dirname, "../dev/server");
  }
};

global.assets = fs.readFileSync(
  path.join(outputPath("client"), "manifest-prod.json"),
  "utf-8"
);

require(path.join(outputPath("server"), "app"));
