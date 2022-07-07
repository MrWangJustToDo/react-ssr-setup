const { spawn } = require("child_process");
const { freePort } = require("./free-port");

const runStaticGenerate = async () => {
  await freePort(process.env.PROD_PORT);
  // start server and generate static page
  spawn("cross-env STATIC_GENERATE=true node", ["./dist/server/app.js"], { shell: true, stdio: "inherit" });
};

module.exports.runStaticGenerate = runStaticGenerate;
