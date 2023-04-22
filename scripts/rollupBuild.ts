import { rollupBuild } from "project-tool/rollup";

const start = async () => {
  await rollupBuild({ packageName: "env", packageScope: "packages" });
  await Promise.all([rollupBuild({ packageName: "axios", packageScope: "packages" }), rollupBuild({ packageName: "chakra", packageScope: "packages" })]);
  process.exit(0);
};

start();
