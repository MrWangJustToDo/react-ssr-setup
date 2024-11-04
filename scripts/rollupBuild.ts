import { rollupBuild } from "project-tool/rollup";

const start = async () => {
  await rollupBuild({ packageName: "env", packageScope: "packages" });
  await Promise.all([rollupBuild({ packageName: "chakra", packageScope: "packages" }), rollupBuild({ packageName: "webpack", packageScope: "packages" })]);
  process.exit(0);
};

start();
