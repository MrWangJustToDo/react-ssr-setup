const { spawn } = require("child_process");

const devPackages = () =>
  spawn("pnpm run dev:packages", {
    shell: true,
    stdio: "inherit",
  });

const devUi = () => spawn("pnpm run dev:ui", { shell: true, stdio: "inherit" });

const dev = () => {
  const packageProcess = devPackages();
  const uiProcess = devUi();

  process.on("exit", () => {
    packageProcess.kill();
    uiProcess.kill();
  });
};

dev();
