import path from "path";

const outputPath = (env: "server" | "client"): string =>
  process.env.NODE_ENV === "production" ? path.resolve(__dirname, "..", "../dist/", env) : path.resolve(__dirname, "..", "../dev/", env);

const manifestFile = (): string => (process.env.NODE_ENV === "production" ? "manifest-prod.json" : "manifest-dev.json");

const manifestLoadable = (env: "server" | "client"): string => path.resolve(outputPath(env), "manifest-loadable.json");

export { manifestFile, manifestLoadable };
