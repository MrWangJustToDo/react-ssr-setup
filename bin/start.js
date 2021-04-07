#!/usr/bin/env node

require("dotenv").config();

require("pretty-error").start();

const fs = require("fs");

const path = require("path");

const outputPath = (env) => (process.env.NODE_ENV === "production" ? path.resolve(__dirname, "../dist/", env) : path.resolve(__dirname, "../dev/", env));

const manifestFile = () => (process.env.NODE_ENV === "production" ? "manifest-prod.json" : "manifest-dev.json");

const manifestLoadable = (env) => path.resolve(outputPath(env), "manifest-loadable.json");

global.assets = JSON.parse(fs.readFileSync(path.join(outputPath("client"), manifestFile()), "utf-8"));

global.webStats = manifestLoadable("client");

require(path.join(outputPath("server"), "app"));
