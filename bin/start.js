#!/usr/bin/env node

require("dotenv").config();
const fs = require("fs");
const path = require("path");

const outputPath = (env) => (process.env.NODE_ENV === "production" ? path.resolve(__dirname, "../static/", env) : path.resolve(__dirname, "../dev/", env));

const manifestFile = () => (process.env.NODE_ENV === "production" ? "manifest-prod.json" : "manifest-dev.json");

// const manifestLoadable = () => path.resolve(outputPath("client"), "mainfest-loadable.json");

global.assets = JSON.parse(fs.readFileSync(path.join(outputPath("client"), manifestFile()), "utf-8"));

// global.loadableManifest = manifestLoadable();

require(path.join(outputPath("server"), "app"));
