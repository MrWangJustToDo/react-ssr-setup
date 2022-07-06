const fs = require("fs");
const http = require("http");
const { spawn } = require("child_process");

const getDepsJsonFile = () => fs.promises.readFile("../dist/client/manifest-deps.json", { encoding: "utf-8" });

const startApp = () =>
  spawn("node", ["./dist/server/app.js"], {
    stdio: "inherit",
    shell: true,
  });

const getStaticRouter = (allRouters) =>
  Object.keys(allRouters).filter((path) => {
    const allPathArray = path.split("/");
    return allPathArray.every((p) => !p.startsWith(":"));
  });

const getCurrentStaticPage = (path) => http.get(path, (res) => {});

const runAllStaticRouter = async () => {
  // start app
  const app = startApp();
  const allRouter = await getDepsJsonFile();
  const allStaticRouter = getStaticRouter(allRouter);

  // close app
  app.kill();
};
